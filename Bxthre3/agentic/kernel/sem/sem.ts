// Agentic v1 — Self-Modification Engine (SEM) (P0)
// Darwin Gödel Cycle: Observe → Hypothesize → Sandbox → Commit
// Source: SOUL.md Principle #6 — Evolve or Die
// Immutable Core: LLM weights frozen, safety constraints unmodifiable, Truth Gate permanent, INBOX routing fixed

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { join, dirname } from "path";

export type SEMPhase = 'OBSERVE' | 'HYPOTHESIZE' | 'SANDBOX' | 'COMMIT' | 'ROLLBACK';
export type ModificationTarget = 'prompt' | 'skill' | 'workflow' | 'rule' | 'agent_config' | 'routing_policy';
export type SEMStatus = 'PROPOSED' | 'IN_REVIEW' | 'SANDBOXING' | 'APPROVED' | 'COMMITTED' | 'REJECTED' | 'ROLLED_BACK';

export interface SEMModification {
  id: string;
  target: ModificationTarget;
  target_path: string;       // file or config path
  delta: string;             // what changes: JSON patch or diff description
  rationale: string;         // why this improves things
  expected_improvement: string;
  proposer: string;           // agent_id or 'brodiblanco'
  created_at: number;
  phase: SEMPhase;
  status: SEMStatus;
  sandbox_result?: any;
  rollback_snapshot?: string; // path to snapshot taken before commit
  commits?: number;          // how many times this mod was committed (version)
}

export interface SEMObservation {
  agent_id: string;
  pattern: string;           // e.g. 'grant-researcher-low-yield', 'sensor-delay-detected'
  frequency: number;        // occurrences in observation window
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  raw_data_sample: string[];
  suggested_modification?: {
    target: ModificationTarget;
    target_path: string;
    delta: string;
    rationale: string;
  };
}

const SEM_DIR = '/home/workspace/Bxthre3/agentic/kernel/sem';
const OBSERVATIONS_FILE = `${SEM_DIR}/observations.jsonl`;
const PROPOSALS_FILE = `${SEM_DIR}/proposals.json`;
const MODIFICATIONS_FILE = `${SEM_DIR}/modifications.json`;
const SNAPSHOTS_DIR = `${SEM_DIR}/snapshots`;
const SEM_VERSION = '1.0.0';

// IMMUTABLE CORE — cannot be modified by SEM
const IMMUTABLE_PATTERNS = [
  'LLM_WEIGHTS', 'SAFETY_CONSTRAINTS', 'TRUTH_GATE', 'INBOX_ROUTING',
  'COMMAND_WHITELIST', 'SHELL_VERSION', 'SEM_VERSION', 'PROTOCOL'
];

function initSEMDirs() {
  try {
    mkdirSync(SEM_DIR, { recursive: true });
    mkdirSync(SNAPSHOTS_DIR, { recursive: true });
    if (!existsSync(PROPOSALS_FILE)) writeFileSync(PROPOSALS_FILE, JSON.stringify([], null, 2));
    if (!existsSync(MODIFICATIONS_FILE)) writeFileSync(MODIFICATIONS_FILE, JSON.stringify([], null, 2));
  } catch {}
}

function isImmutable(target_path: string): boolean {
  return IMMUTABLE_PATTERNS.some(p => target_path.toUpperCase().includes(p));
}

function takeSnapshot(targetPath: string): string | null {
  try {
    if (!existsSync(targetPath)) return null;
    const snapId = `snap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const snapPath = `${SNAPSHOTS_DIR}/${snapId}`;
    copyFileSync(targetPath, snapPath);
    return snapPath;
  } catch {
    return null;
  }
}

function restoreSnapshot(snapPath: string, targetPath: string): boolean {
  try {
    if (!existsSync(snapPath)) return false;
    const snapDir = dirname(targetPath);
    mkdirSync(snapDir, { recursive: true });
    copyFileSync(snapPath, targetPath);
    return true;
  } catch {
    return false;
  }
}

// ====== PUBLIC API ======

export function observe(o: SEMObservation): void {
  initSEMDirs();
  const line = JSON.stringify({ ...o, _t: Date.now() }) + '\n';
  try { writeFileSync(OBSERVATIONS_FILE, line, { flag: 'a' }); } catch {}
}

export function propose(mod: Omit<SEMModification, 'id' | 'created_at' | 'phase' | 'status'>): SEMModification {
  initSEMDirs();
  if (isImmutable(mod.target_path)) {
    throw new Error(`IMMUTABLE_VIOLATION: Cannot propose modifications to immutable core: ${mod.target_path}`);
  }
  const proposal: SEMModification = {
    ...mod,
    id: `sem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: Date.now(),
    phase: 'HYPOTHESIZE',
    status: 'PROPOSED',
  };
  try {
    const proposals = JSON.parse(readFileSync(PROPOSALS_FILE, 'utf-8'));
    proposals.push(proposal);
    writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2));
  } catch {}
  return proposal;
}

export function sandboxTest(proposalId: string, testFn: (mod: SEMModification) => any): any {
  initSEMDirs();
  let proposals: SEMModification[] = [];
  try { proposals = JSON.parse(readFileSync(PROPOSALS_FILE, 'utf-8')); } catch {}
  const proposal = proposals.find(p => p.id === proposalId);
  if (!proposal) throw new Error(`Proposal ${proposalId} not found`);
  
  proposal.phase = 'SANDBOX';
  proposal.status = 'SANDBOXING';
  try { writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2)); } catch {}
  
  let result: any;
  try {
    result = testFn(proposal);
    proposal.sandbox_result = { passed: true, result };
    proposal.status = 'APPROVED';
  } catch (err: any) {
    proposal.sandbox_result = { passed: false, error: err.message };
    proposal.status = 'REJECTED';
  }
  try { writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2)); } catch {}
  return result;
}

export function commit(proposalId: string, targetContent: string): boolean {
  initSEMDirs();
  if (isImmutable(proposalId)) return false;
  
  let proposals: SEMModification[] = [];
  try { proposals = JSON.parse(readFileSync(PROPOSALS_FILE, 'utf-8')); } catch {}
  const proposal = proposals.find(p => p.id === proposalId);
  if (!proposal) return false;
  if (proposal.status !== 'APPROVED') return false;
  
  // Snapshot current state before overwriting
  const snapPath = takeSnapshot(proposal.target_path);
  
  try {
    mkdirSync(dirname(proposal.target_path), { recursive: true });
    writeFileSync(proposal.target_path, targetContent);
    proposal.rollback_snapshot = snapPath ?? undefined;
    proposal.phase = 'COMMIT';
    proposal.status = 'COMMITTED';
    (proposal.commits as number) = (proposal.commits ?? 0) + 1;
    
    // Log to modifications history
    const mods: SEMModification[] = [];
    try { const existing = readFileSync(MODIFICATIONS_FILE, 'utf-8'); mods.push(...JSON.parse(existing)); } catch {}
    mods.push(proposal);
    writeFileSync(MODIFICATIONS_FILE, JSON.stringify(mods, null, 2));
    
    // Update proposals
    writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2));
    return true;
  } catch {
    return false;
  }
}

export function rollback(proposalId: string): boolean {
  initSEMDirs();
  let proposals: SEMModification[] = [];
  try { proposals = JSON.parse(readFileSync(PROPOSALS_FILE, 'utf-8')); } catch {}
  const proposal = proposals.find(p => p.id === proposalId);
  if (!proposal) return false;
  
  if (proposal.rollback_snapshot) {
    const restored = restoreSnapshot(proposal.rollback_snapshot, proposal.target_path);
    if (!restored) return false;
  }
  
  proposal.phase = 'ROLLBACK';
  proposal.status = 'ROLLED_BACK';
  try { writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2)); } catch {}
  return true;
}

export function getProposals(status?: SEMStatus): SEMModification[] {
  initSEMDirs();
  try {
    const proposals: SEMModification[] = JSON.parse(readFileSync(PROPOSALS_FILE, 'utf-8'));
    return status ? proposals.filter(p => p.status === status) : proposals;
  } catch {
    return [];
  }
}

export function getModificationHistory(): SEMModification[] {
  initSEMDirs();
  try {
    return JSON.parse(readFileSync(MODIFICATIONS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}
