package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"sync"
	"time"
)

// StressTest simulates a full 1,280 node subdistrict hitting a single DHU
func RunStressTest(ac *AllianceChain, nodeCount int, txCount int) {
	log.Printf("[STRESS] Starting Phase 3 Stress Test: %d nodes, %d transactions", nodeCount, txCount)
	
	var wg sync.WaitGroup
	start := time.Now()

	// Simulate concurrent LoRa bursts from L1 nodes
	for i := 0; i < txCount; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			
			// Random delay to simulate asynchronous mesh arrival
			time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
			
			from := fmt.Sprintf("field_%d", rand.Intn(100))
			to := fmt.Sprintf("field_%d", rand.Intn(100))
			amount := rand.Float64() * 100.0
			
			ac.InitiateTrade(from, to, amount)
		}(i)
	}

	wg.Wait()
	duration := time.Since(start)
	log.Printf("[STRESS] Stress Test Completed in %v. Throughput: %.2f tx/sec", 
		duration, float64(txCount)/duration.Seconds())
}

// ByzantineSimulator injects malicious messages into the HandleMessage stream
func InjectByzantineFault(ac *AllianceChain, sequence int) {
	log.Printf("[ADVERSARIAL] Injecting Byzantine Fault for sequence %d", sequence)
	
	// Malicious Peer 1: Sends a fake PREPARE for a non-existent payload
	fakeMsg := PBFTMessage{
		Phase:    Prepare,
		NodeID:   "MALICIOUS_NODE_01",
		Sequence: sequence,
		Payload:  "CORRUPT_DATA",
	}
	ac.HandleMessage(fakeMsg)
	
	// Malicious Peer 2: Sends a fake COMMIT early
	fakeCommit := PBFTMessage{
		Phase:    Commit,
		NodeID:   "MALICIOUS_NODE_02",
		Sequence: sequence,
		Payload:  "CORRUPT_DATA",
	}
	ac.HandleMessage(fakeCommit)
}
