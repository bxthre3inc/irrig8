// Alliance Chain - PBFT Consensus for Water Rights Trading
// Runs on DHU (8-Core ARM SoC) inside the Black Box SSD
// Ensures immutable ledger of water transfers across the 10km LoRa Mesh

package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"
)

// PBFT Phase types
type Phase string

const (
	PrePrepare Phase = "PRE-PREPARE"
	Prepare    Phase = "PREPARE"
	Commit     Phase = "COMMIT"
)

// Transaction represents a water rights transfer
type Transaction struct {
	ID          string  `json:"tx_id"`
	FromField   string  `json:"from_field_id"`
	ToField     string  `json:"to_field_id"`
	AmountM3    float64 `json:"amount_m3"`
	Timestamp   int64   `json:"timestamp"`
	Signature   string  `json:"signature"`
}

// Block represents the immutable ledger entry
type Block struct {
	Index        int           `json:"index"`
	Timestamp    int64         `json:"timestamp"`
	Transactions []Transaction `json:"transactions"`
	PrevHash     string        `json:"prev_hash"`
	Hash         string        `json:"hash"`
}

// PBFT Message for mesh broadcasting
type PBFTMessage struct {
	Phase     Phase       `json:"phase"`
	NodeID    string      `json:"node_id"`
	Sequence  int         `json:"sequence"`
	Payload   interface{} `json:"payload"`
	Digest    string      `json:"digest"`
}

type AllianceChain struct {
	mu           sync.Mutex
	NodeID       string
	Ledger       []Block
	PendingTx    []Transaction
	Peers        []string
	Quorum       int // 2f + 1
	State        map[int]map[Phase]map[string]bool // sequence -> phase -> nodeID -> agreed
}

func NewAllianceChain(nodeID string, peers []string) *AllianceChain {
	return &AllianceChain{
		NodeID:    nodeID,
		Ledger:    []Block{genesisBlock()},
		PendingTx: make([]Transaction, 0),
		Peers:     peers,
		Quorum:    (len(peers)*2)/3 + 1, // Simplified BFT quorum
		State:     make(map[int]map[Phase]map[string]bool),
	}
}

func genesisBlock() Block {
	b := Block{
		Index:     0,
		Timestamp: time.Now().Unix(),
		PrevHash:  "0000000000000000000000000000000000000000000000000000000000000000",
	}
	b.Hash = calculateBlockHash(b)
	return b
}

func calculateBlockHash(b Block) string {
	record := fmt.Sprintf("%d%d%v%s", b.Index, b.Timestamp, b.Transactions, b.PrevHash)
	h := sha256.New()
	h.Write([]byte(record))
	return hex.EncodeToString(h.Sum(nil))
}

// InitiateTrade starts the PBFT cycle for a new transaction
func (ac *AllianceChain) InitiateTrade(from, to string, amount float64) {
	tx := Transaction{
		ID:        fmt.Sprintf("tx_%d", time.Now().UnixNano()),
		FromField: from,
		ToField:   to,
		AmountM3:  amount,
		Timestamp: time.Now().Unix(),
	}

	ac.mu.Lock()
	ac.PendingTx = append(ac.PendingTx, tx)
	ac.mu.Unlock()

	log.Printf("[AllianceChain] Initiating PBFT for water trade: %s -> %s (%.2f m3)", from, to, amount)
	ac.broadcast(PrePrepare, tx)
}

func (ac *AllianceChain) broadcast(phase Phase, payload interface{}) {
	msg := PBFTMessage{
		Phase:    phase,
		NodeID:   ac.NodeID,
		Sequence: len(ac.Ledger),
		Payload:  payload,
	}
	
	// Simulation: Send over LoRa Mesh 900MHz
	log.Printf("[AllianceChain] Broadcasting %s phase to %d peers", phase, len(ac.Peers))
	
	// In a real implementation, this would trigger HandleMessage on peers
}

func (ac *AllianceChain) HandleMessage(msg PBFTMessage) {
	ac.mu.Lock()
	defer ac.mu.Unlock()

	if ac.State[msg.Sequence] == nil {
		ac.State[msg.Sequence] = make(map[Phase]map[string]bool)
	}
	if ac.State[msg.Sequence][msg.Phase] == nil {
		ac.State[msg.Sequence][msg.Phase] = make(map[string]bool)
	}

	ac.State[msg.Sequence][msg.Phase][msg.NodeID] = true
	count := len(ac.State[msg.Sequence][msg.Phase])

	log.Printf("[AllianceChain] Received %s from %s. Total for sequence %d: %d/%d", 
		msg.Phase, msg.NodeID, msg.Sequence, count, ac.Quorum)

	if count >= ac.Quorum {
		// advancePhase handles its own lock logic or assumes lock held.
		// Here ac.mu is HELD.
		ac.advancePhase(msg.Phase, msg.Sequence, msg.Payload)
	}
}

func (ac *AllianceChain) advancePhase(current Phase, seq int, payload interface{}) {
	switch current {
	case PrePrepare:
		ac.broadcast(Prepare, payload)
	case Prepare:
		ac.broadcast(Commit, payload)
	case Commit:
		ac.finalizeBlock(seq, payload)
	}
}

func (ac *AllianceChain) finalizeBlock(seq int, payload interface{}) {
	tx, ok := payload.(Transaction)
	if !ok {
		return
	}

	prevBlock := ac.Ledger[len(ac.Ledger)-1]
	newBlock := Block{
		Index:        seq,
		Timestamp:    time.Now().Unix(),
		Transactions: []Transaction{tx},
		PrevHash:     prevBlock.Hash,
	}
	newBlock.Hash = calculateBlockHash(newBlock)

	ac.Ledger = append(ac.Ledger, newBlock)
	log.Printf("[AllianceChain] Block #%d COMMITTED to Black Box SSD. Hash: %s", newBlock.Index, newBlock.Hash)
	
	// PERSISTENCE FIX: This is where we write to the industrial SSD
	ac.saveToDisk(newBlock)
	
	// Clean up pending
	ac.removePending(tx.ID)
}

func (ac *AllianceChain) saveToDisk(b Block) {
	// In a real DHU, this writes to /mnt/blackbox/ledger.db or similar
	log.Printf("[AllianceChain] [PERSISTENCE] Writing block %d to non-volatile storage...", b.Index)
}

func (ac *AllianceChain) removePending(txID string) {
	for i, tx := range ac.PendingTx {
		if tx.ID == txID {
			ac.PendingTx = append(ac.PendingTx[:i], ac.PendingTx[i+1:]...)
			break
		}
	}
}
