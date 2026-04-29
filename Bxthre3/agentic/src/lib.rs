pub mod core;
pub mod db;
pub mod types;
pub mod orchestration;
pub mod agents;
pub mod mesh;
pub mod tenants;
pub mod integrations;

// Re-export core primitives
pub use core::truth_gate::{TruthGate, VerifyResult, DataClass, SourceHash};
pub use core::shell::{DeterministicShell, ConstraintViolation};

pub use db::Database;
pub use types::*;
