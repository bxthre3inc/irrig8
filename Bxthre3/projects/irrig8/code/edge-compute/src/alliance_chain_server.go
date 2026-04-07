// Alliance Chain HTTP Server
// Exposes a lightweight REST API on the DHU so the Python backend can
// initiate PBFT water-rights trades and receive finalization callbacks.
//
// Endpoints:
//   POST /trade      — initiate a new water trade into the PBFT cycle
//   GET  /ledger     — return the current blockchain ledger as JSON
//   POST /callback   — test endpoint: simulate receiving a PBFT commit (dev only)
//
// The DHU calls back to BackendCallbackURL upon finalizeBlock().

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// TradeRequest is the JSON body expected from the Python backend.
type TradeRequest struct {
	TxID        string  `json:"tx_id"`
	FromFieldID string  `json:"from_field_id"`
	ToFieldID   string  `json:"to_field_id"`
	AmountM3    float64 `json:"amount_m3"`
}

// CallbackPayload is sent back to the Python backend once PBFT commits the block.
type CallbackPayload struct {
	TxID      string `json:"tx_id"`
	Status    string `json:"status"` // "COMMITTED" | "FAILED"
	BlockHash string `json:"block_hash"`
	Timestamp int64  `json:"timestamp"`
}

// AllianceChainServer wraps the AllianceChain with an HTTP interface.
type AllianceChainServer struct {
	chain               *AllianceChain
	backendCallbackURL  string
	port                int
}

func NewAllianceChainServer(nodeID string, peers []string, port int, callbackURL string) *AllianceChainServer {
	return &AllianceChainServer{
		chain:              NewAllianceChain(nodeID, peers),
		backendCallbackURL: callbackURL,
		port:               port,
	}
}

// Start registers all HTTP handlers and begins listening.
func (s *AllianceChainServer) Start() {
	mux := http.NewServeMux()
	mux.HandleFunc("/trade", s.handleTrade)
	mux.HandleFunc("/ledger", s.handleLedger)
	mux.HandleFunc("/health", s.handleHealth)

	addr := fmt.Sprintf(":%d", s.port)
	log.Printf("[AllianceChainServer] HTTP server listening on %s", addr)

	srv := &http.Server{
		Addr:         addr,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("[AllianceChainServer] Fatal: %v", err)
	}
}

// handleTrade accepts a trade initiation from the Python backend.
// It validates the payload and fires the PBFT cycle.
func (s *AllianceChainServer) handleTrade(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req TradeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, fmt.Sprintf("invalid JSON: %v", err), http.StatusBadRequest)
		return
	}

	if req.TxID == "" || req.FromFieldID == "" || req.ToFieldID == "" || req.AmountM3 <= 0 {
		http.Error(w, "missing required fields: tx_id, from_field_id, to_field_id, amount_m3 > 0", http.StatusBadRequest)
		return
	}

	log.Printf("[AllianceChainServer] Trade received: %s (%.2f m³: %s → %s)",
		req.TxID, req.AmountM3, req.FromFieldID, req.ToFieldID)

	// Fire PBFT cycle (non-blocking — consensus happens asynchronously)
	go func() {
		s.chain.InitiateTrade(req.FromFieldID, req.ToFieldID, req.AmountM3)

		// Once PBFT finalizes (synchronous in current implementation), call back.
		// In a real multi-DHU mesh this fires after quorum is reached.
		latestBlock := s.chain.Ledger[len(s.chain.Ledger)-1]
		s.notifyBackend(req.TxID, "COMMITTED", latestBlock.Hash)
	}()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "accepted",
		"tx_id":  req.TxID,
		"note":   "PBFT consensus started; backend will be called back on commit",
	})
}

// handleLedger returns the current blockchain state as JSON.
func (s *AllianceChainServer) handleLedger(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	s.chain.mu.Lock()
	defer s.chain.mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"node_id":      s.chain.NodeID,
		"block_count":  len(s.chain.Ledger),
		"pending_tx":   len(s.chain.PendingTx),
		"quorum":       s.chain.Quorum,
		"ledger":       s.chain.Ledger,
	})
}

// handleHealth is a simple liveness probe endpoint.
func (s *AllianceChainServer) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok", "node": s.chain.NodeID})
}

// notifyBackend POSTs a callback to the Python FastAPI backend once a block is finalized.
func (s *AllianceChainServer) notifyBackend(txID, status, blockHash string) {
	if s.backendCallbackURL == "" {
		log.Printf("[AllianceChainServer] No callback URL configured, skipping notification for %s", txID)
		return
	}

	payload := CallbackPayload{
		TxID:      txID,
		Status:    status,
		BlockHash: blockHash,
		Timestamp: time.Now().Unix(),
	}

	body, err := json.Marshal(payload)
	if err != nil {
		log.Printf("[AllianceChainServer] Failed to marshal callback payload: %v", err)
		return
	}

	url := fmt.Sprintf("%s/api/v1/trade/callback", s.backendCallbackURL)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		log.Printf("[AllianceChainServer] Callback to backend failed for tx %s: %v", txID, err)
		return
	}
	defer resp.Body.Close()

	log.Printf("[AllianceChainServer] Callback sent for tx %s → HTTP %d", txID, resp.StatusCode)
}
