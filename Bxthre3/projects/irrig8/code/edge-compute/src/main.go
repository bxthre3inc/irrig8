package main

import (
	"log"
	"time"
)

func main() {
	log.Println("[BOOT] FarmSense AllianceChain Phase 3 Vetting Environment Starting...")

	// 1. Initialize AllianceChain with 4 dummy peers (Quorum = 2f+1 = 3)
	nodeID := "DHU_PRIMARY"
	peers := []string{"PEER_01", "PEER_02", "PEER_03", "PEER_04"}
	ac := NewAllianceChain(nodeID, peers)

	// 2. Run Stress Test (1,280 nodes, 100 concurrent tx)
	log.Println("[PHASE_1] Starting L1 Mesh Stress Simulation...")
	RunStressTest(ac, 1280, 100)

	// 3. Inject Byzantine Fault
	log.Println("[PHASE_2] Starting Adversarial Byzantine Injection...")
	InjectByzantineFault(ac, 0) // Sequence 0
	
	// Check if ledger is still valid or if it was corrupted
	time.Sleep(2 * time.Second)
	ac.mu.Lock()
	log.Printf("[RESULT] Final Ledger Size: %d, Quorum: %d", len(ac.Ledger), ac.Quorum)
	ac.mu.Unlock()

	log.Println("[PHASE_3] Resilience Audit Complete.")
}
