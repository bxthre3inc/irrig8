// Agentic v1 — Self-Modification Engine (SEM)
// Darwin Gödel Cycle: Observe → Hypothesize → Sandbox → Commit → Rollback
// Immutable core: LLM weights frozen, Safety constraints unmodifiable, Truth Gate permanent, INBOX routing fixed

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, rmSync } from \'fs\';
import { readdirSync } from \'fs\';
import { dirname, join } from \'path\';

const STORE_DIR = \'/dev/shm/agentic/sem\';
const VAULT_DIR = \'/home/workspace/Bxthre3/VAULT/sem-changes\';
const IMAGES_DIR = \'/dev/shm/agentic/sem/images\';

// === IMMUTABLE CORE (never modifiable) ===
const IMMUTABLE_PATTERNS = [
  /SOUL\.md$/i,           // Behavioral identity
  /INBOX_ROUTING/i,        // INBOX routing fixed
  /truth.gate/i,           // Truth Gate permanent
  /AGENTS\.md$/i,          // Agent roster
  /LLM.*weights/i,         // LLM weights frozen
  /safety.*constraint/i,   // Safety constraints unmodifiable
];

// === SEM PHASES ===
const SEM_PHASES = [\'OBSERVE\', \'HYPOTHESIZE\', \'SANDBOX\', \'COMMIT\', \'ROLLBACK\'] as const;

// === CHANGE PROPOSAL ===
interface ChangeProposal {
  id: string;
  agent_id: string;
  phase: typeof SEM_PHASES[number];
  target_file: string;
  current_snippet: string;
  proposed_snippet: string;
  rationale: string;
  created_at: number;
  status: \'proposed\' | \'sandboxed\' | \'committed\' | \'rejected\' | \'rolled_back\';
  sandbox_result?: { passed: boolean; errors: string[]; warnings: string[] };
  vote_result?: { approved: boolean; votes: Record<string, \'approve\' | \'reject\' | \'abstain\'> };
  rollback_point?: string;
}

function ensureDirs() {
  for (const d of [STORE_DIR, VAULT_DIR, IMAGES_DIR]) {
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
  }
}

function isImmutable(filePath: string): boolean {
  return IMMUTABLE_PATTERNS.some(p => p.test(filePath));
}

function createRollbackPoint(targetFile: string): string {
  ensureDirs();
  const timestamp = Date.now();
  const id = `rollback-${timestamp}`;
  const destDir = \`\${STORE_DIR}/\${id}\`;
  mkdirSync(destDir, { recursive: true });
  try {
    cpSync(targetFile, \`\${destDir}/snapshot\`);
    // Also snapshot parent directory
    const parent = dirname(targetFile);
    const grandParent = dirname(parent);
    const baseName = parent.split(\'\/\').pop() || \'dir\';
    cpSync(parent, \`\${destDir}/\${baseName}\`, { recursive: true });
    writeFileSync(\`\${destDir}/manifest.json\`, JSON.stringify({
      id, target_file: targetFile, created_at: timestamp, phase: \'ROLLBACK_POINT\',
    }));
  } catch {
    // If file doesn\'t exist yet, create empty placeholder
    writeFileSync(\`\${destDir}/manifest.json\`, JSON.stringify({
      id, target_file: targetFile, created_at: timestamp, phase: \'ROLLBACK_POINT\', is_new: true,
    }));
  }
  return id;
}

function applySandbox(proposed: ChangeProposal): { passed: boolean; errors: string[]; warnings: string[] } {
  ensureDirs();
  const sandboxDir = \`\${STORE_DIR}/sandbox-\${proposed.id}\`;
  mkdirSync(sandboxDir, { recursive: true });

  const errors: string[] = [];
  const warnings: string[] = [];

  // Copy target to sandbox
  try {
    if (existsSync(proposed.target_file)) {
      cpSync(proposed.target_file, \`\${sandboxDir}/original\`);
      // Apply proposed change as patch simulation
      const content = readFileSync(proposed.target_file, \'utf-8\');
      const patched = content.replace(
        proposed.current_snippet || /./g,
        proposed.proposed_snippet,
      );
      writeFileSync(\`\${sandboxDir}/patched\`, patched);
    } else {
      writeFileSync(\`\${sandboxDir}/new_file\`, proposed.proposed_snippet);
    }
  } catch (e: unknown) {
    errors.push(\`Sandbox copy failed: \${(e as Error).message}\`);
  }

  // Validate: check for dangerous patterns
  const dangerous = [\'rm -rf\', \'eval(\', \'__import__\', \'exec(\', \'subprocess\', \'os.system\'];
  for (const d of dangerous) {
    if (proposed.proposed_snippet.includes(d)) {
      warnings.push(\`Dangerous pattern detected: \${d}\`);
    }
  }

  // Simulate semantic checks
  if (proposed.proposed_snippet.includes(\'console.log\') && proposed.target_file.includes(\'.kt\')) {
    warnings.push(\'Kotlin file contains console.log — likely wrong\');
  }

  writeFileSync(\`\${sandboxDir}/validation.json\`, JSON.stringify({ passed: errors.length === 0, errors, warnings }));

  return { passed: errors.length === 0, errors, warnings };
}

function commitChange(proposal: ChangeProposal): { success: boolean; committed_at: number; error?: string } {
  ensureDirs();
  if (isImmutable(proposal.target_file)) {
    return { success: false, committed_at: Date.now(), error: \'File is in immutable core — cannot modify\' };
  }

  try {
    if (existsSync(proposal.target_file)) {
      const original = readFileSync(proposal.target_file, \'utf-8\');
      const updated = original.replace(
        proposal.current_snippet || /./g,
        proposal.proposed_snippet,
      );
      writeFileSync(proposal.target_file, updated);
    } else {
      writeFileSync(proposal.target_file, proposal.proposed_snippet);
    }

    // Archive to VAULT
    const vaultEntry = {
      ...proposal,
      status: \'committed\',
      committed_at: Date.now(),
      hash: createHash(proposed.proposed_snippet),
    };
    writeFileSync(
      \`\${VAULT_DIR}/\${proposal.id}-\${proposal.phase.toLowerCase()}.json\`,
      JSON.stringify(vaultEntry, null, 2),
    );

    return { success: true, committed_at: Date.now() };
  } catch (e: unknown) {
    return { success: false, committed_at: Date.now(), error: (e as Error).message };
  }
}

function rollback(rollbackPointId: string): { success: boolean; error?: string } {
  const snapDir = \`\${STORE_DIR}/\${rollbackPointId}\`;
  if (!existsSync(snapDir)) return { success: false, error: \'Rollback point not found\' };

  try {
    const manifest = JSON.parse(readFileSync(\`\${snapDir}/manifest.json\`, \'utf-8\'));
    if (manifest.is_new) {
      // Was a new file — delete it
      try { rmSync(manifest.target_file); } catch { /* already gone */ }
    } else {
      // Restore from snapshot
      const parent = dirname(manifest.target_file);
      const baseName = parent.split(\'\/\').pop() || \'dir\';
      cpSync(\`\${snapDir}/\${baseName}\`, parent, { recursive: true });
    }

    writeFileSync(\`\${snapDir}/rollback_applied.json\`, JSON.stringify({
      applied_at: Date.now(), rollback_point: rollbackPointId,
    }));

    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message };
  }
}

function observeAndHypothesize(agentId: string): {
  observations: string[]; hypotheses: string[]; files_analyzed: number;
} {
  ensureDirs();
  const observations: string[] = [];
  const hypotheses: string[] = [];
  let filesAnalyzed = 0;

  // Analyze recent error logs
  try {
    const errorLog = \`\${STORE_DIR}/../shell-violations.jsonl\`;
    if (existsSync(errorLog)) {
      const lines = readFileSync(errorLog, \'utf-8\').split(\'\n\').filter(Boolean).slice(-20);
      const violations = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
      const blockedCommands = new Set(violations.map((v: any) => v.command).filter(Boolean));
      if (blockedCommands.size > 0) {
        observations.push(\`\${blockedCommands.size} commands blocked by safety — review whitelist?\`);
        hypotheses.push(\`Expand whitelist for \${[...blockedCommands].slice(0, 3).join(\', \')}\`);
      }
    }
  } catch {}

  // Analyze truth gate log
  try {
    const truthLog = \`\${STORE_DIR}/../truth-gate-log.jsonl\`;
    if (existsSync(truthLog)) {
      const lines = readFileSync(truthLog, \'utf-8\').split(\'\n\').filter(Boolean).slice(-50);
      const blocks = lines.filter(l => { try { return JSON.parse(l).result === \'BLOCK\'; } catch { return false; } });
      if (blocks.length > 5) {
        observations.push(\`\${blocks.length} Truth Gate blocks in recent history — data freshness issue\`);
        hypotheses.push(\'Improve data freshness for market_intel and financials\');
      }
    }
  } catch {}

  // Analyze Thompson Q performance
  try {
    const qStore = \`\${STORE_DIR}/../thompson-q.json\`;
    if (existsSync(qStore)) {
      const q = JSON.parse(readFileSync(qStore, \'utf-8\'));
      const poorPerformers = Object.entries(q.q_entries || {}).filter(([_, e]: [string, any]) => (e.alpha / (e.alpha + e.beta)) < 0.6);
      if (poorPerformers.length > 0) {
        observations.push(\`\${poorPerformers.length} agents with <60% Thompson mean\`);
        hypotheses.push(\`Retrain IER weights for underperforming agents: \${poorPerformers.slice(0, 3).map(([k]) => k).join(\', \')}\`);
      }
    }
  } catch {}

  filesAnalyzed = 3;

  return { observations, hypotheses, files_analyzed: filesAnalyzed };
}

interface SEMRequest { operation: string; agent_id?: string; prompt?: string; skill_context?: string; }
interface SEMResponse {
  status: string; changes: number; rollback_point: string; cycle_phase: string;
  observations?: string[]; hypotheses?: string[]; files_analyzed?: number;
  proposal_id?: string; sandbox_result?: { passed: boolean; errors: string[]; warnings: string[] };
  commit_result?: { success: boolean; error?: string };
}

function semProcess(req: SEMRequest): SEMResponse {
  ensureDirs();
  const now = Date.now();

  switch (req.operation) {
    case \'observe\': {
      const result = observeAndHypothesize(req.agent_id || \'system\');
      return { status: \'OK\', changes: 0, rollback_point: \'\', cycle_phase: \'OBSERVE\', ...result };
    }

    case \'propose\': {
      if (!req.agent_id || !req.prompt) {
        return { status: \'ERROR\', changes: 0, rollback_point: \'\', cycle_phase: \'HYPOTHESIZE\', error: \'Missing agent_id or prompt\' };
      }
      const id = `prop-\${now}`;
      const proposal: ChangeProposal = {
        id, agent_id: req.agent_id, phase: \'HYPOTHESIZE\',
        target_file: \`/home/workspace/Bxthre3/agentic/skill-context/\${req.agent_id}.md\`,
        current_snippet: \'\', proposed_snippet: req.prompt,
        rationale: req.skill_context || \'Agent proposed improvement\',
        created_at: now, status: \'proposed\',
      };
      writeFileSync(\`\${STORE_DIR}/\${id}.json\`, JSON.stringify(proposal, null, 2));
      return { status: \'OK\', changes: 1, rollback_point: id, cycle_phase: \'HYPOTHESIZE\', proposal_id: id };
    }

    case \'sandbox\': {
      if (!req.agent_id) return { status: \'ERROR\', changes: 0, rollback_point: \'\', cycle_phase: \'SANDBOX\' };
      const propFile = \`\${STORE_DIR}/\${req.agent_id}.json\`;
      if (!existsSync(propFile)) return { status: \'ERROR\', changes: 0, rollback_point: \'\', cycle_phase: \'SANDBOX\', error: \'Proposal not found\' };
      const proposal: ChangeProposal = JSON.parse(readFileSync(propFile, \'utf-8\'));
      const result = applySandbox(proposal);
      proposal.status = \'sandboxed\';
      proposal.sandbox_result = result;
      writeFileSync(propFile, JSON.stringify(proposal));
      return { status: \'OK\', changes: 0, rollback_point: \'\', cycle_phase: \'SANDBOX\', sandbox_result: result };
    }

    case \'commit\': {
      if (!req.agent_id) return { status: \'ERROR\', changes: 0, rollback_point: \'\', cycle_phase: \'COMMIT\' };
      const propFile = \`\${STORE_DIR}/\${req.agent_id}.json\`;
      if (!existsSync(propFile)) return { status: \'ERROR\', changes: 0, rollback_point: \'\', cycle_phase: \'COMMIT\', error: \'Proposal not found\' };
      const proposal: ChangeProposal = JSON.parse(readFileSync(propFile, \'utf-8\'));
      const rollbackPt = createRollbackPoint(proposal.target_file);
      const result = commitChange(proposal);
      proposal.status = result.success ? \'committed\' : \'rejected\';
      proposal.rollback_point = rollbackPt;
      proposal.commit_result = result;
      writeFileSync(propFile, JSON.stringify(proposal, null, 2));
      return { status: result.success ? \'OK\' : \'ERROR\', changes: result.success ? 1 : 0, rollback_point: rollbackPt, cycle_phase: \'COMMIT\', commit_result: result };
    }

    case \'rollback\': {
      if (!req.agent_id) return { status: \'ERROR\', changes: 0, rollback_point: \'\', cycle_phase: \'ROLLBACK\' };
      const result = rollback(req.agent_id);
      return { status: result.success ? \'OK\' : \'ERROR\', changes: result.success ? 1 : 0, rollback_point: req.agent_id, cycle_phase: \'ROLLBACK\', error: result.error };
    }

    case \'status\': {
      if (!existsSync(STORE_DIR)) return { status: \'OK\', changes: 0, rollback_point: \'\', cycle_phase: \'OBSERVE\' };
      const files = readdirSync(STORE_DIR).filter(f => f.endsWith(\'.json\') && !f.includes(\'manifest\') && !f.includes(\'rollback\'));
      const proposals = files.map(f => {
        try { return JSON.parse(readFileSync(\`\${STORE_DIR}/\${f}\`, \'utf-8\')); } catch { return null; }
      }).filter(Boolean);
      const committed = proposals.filter((p: any) => p.status === \'committed\').length;
      const pending = proposals.filter((p: any) => p.status === \'proposed\').length;
      return {
        status: \'OK\', changes: committed, rollback_point: pending > 0 ? \`\${pending} pending\` : \'none\',
        cycle_phase: pending > 0 ? \'HYPOTHESIZE\' : \'OBSERVE\',
        observations: [\`\${committed} committed, \${pending} pending\`],
        hypotheses: [],
        files_analyzed: 0,
      };
    }

    default:
      return { status: \'ERROR\', changes: 0, rollback_point: \'\', cycle_phase: \'OBSERVE\', error: \`Unknown operation: \${req.operation}\` };
  }
}

import { createHash } from \'crypto\';
export { semProcess, isImmutable, createRollbackPoint, applySandbox, commitChange, rollback };
export type { SEMRequest, SEMResponse, ChangeProposal };
