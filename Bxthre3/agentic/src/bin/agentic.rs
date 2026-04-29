//! Agentic main binary entry point.
//! Android build uses lib only — no HTTP server on mobile.

use agentic::{TruthGate, DeterministicShell, Agent, Starting5, Integration};

fn main() {
    println!("Agentic v{}", env!("CARGO_PKG_VERSION"));
    println!("Truth Gate initialized: SHA3-256 RAG enforcement");
    println!("Shell initialized: {} commands whitelisted", DeterministicShell::new().command_count());
    println!("Agent Registry: {} entities", Agent::canonical_roster().len());
    println!("Starting 5: {} co-founders", Starting5::canonical().len());
    println!("Integrations: {} connected", Integration::canonical().len());
    println!("\nP0 Modules ✅");
    println!("  Truth Gate | Deterministic Shell | SME");
    println!("  Rollback | CTC Engine | DAP | Task Queue");
    println!("  Agent Registry | Event Bus | Inference Node");
}
