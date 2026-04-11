// Agentic v1 — Truth Gate ENFORCEMENT
// Rule: No-Fetch, No-Think — mandatory source verification before any reasoning
// Immutable core: LLM weights frozen, Safety constraints unmodifiable, Truth Gate permanent

import { readFileSync, writeFileSync, existsSync, mkdirSync } from \'fs\';
import { createHash } from \'crypto\';

const STORE_DIR = \'/dev/shm/agentic\';
const DATA_CLASSES = [\'market_intel\', \'financials\', \'corporate_policy\', \'project_context\'] as const;
const MAX_AGE_MS: Record<string, number> = {
  market_intel: 24 * 3600 * 1000,     // 24h
  financials: 60 * 60 * 1000,           // 1h
  corporate_policy: 7 * 24 * 3600 * 1000, // 7d
  project_context: 4 * 3600 * 1000,     // 4h
};
const TRUTH_LOG = \`\${STORE_DIR}/truth-gate-log.jsonl\`;

function ensureDir() {
  if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true });
  if (!existsSync(TRUTH_LOG)) writeFileSync(TRUTH_LOG, \'\');
}

function hashPayload(data: string): string {
  return createHash(\'sha3-256\').update(data).digest(\'hex\');
}

function getStoredHash(dataClass: string): string | null {
  const indexPath = \`\${STORE_DIR}/truth-hashes.\${dataClass}.json\`;
  if (!existsSync(indexPath)) return null;
  try {
    const index = JSON.parse(readFileSync(indexPath, \'utf-8\'));
    return index.hash || null;
  } catch { return null; }
}

function storeHash(dataClass: string, data: string, maxAgeMs: number): void {
  ensureDir();
  const indexPath = \`\${STORE_DIR}/truth-hashes.\${dataClass}.json\`;
  writeFileSync(indexPath, JSON.stringify({
    hash: hashPayload(data),
    stored_at: Date.now(),
    max_age_ms: maxAgeMs,
    data_class: dataClass,
  }, null, 2));
}

function verifyHash(dataClass: string, data: string): { valid: boolean; staleness_ms: number } {
  ensureDir();
  const indexPath = \`\${STORE_DIR}/truth-hashes.\${dataClass}.json\`;
  if (!existsSync(indexPath)) return { valid: false, staleness_ms: -1 };
  try {
    const index = JSON.parse(readFileSync(indexPath, \'utf-8\'));
    const currentHash = hashPayload(data);
    const hashValid = currentHash === index.hash;
    const staleness = index.max_age_ms > 0 ? (Date.now() - index.stored_at) : 0;
    const stalenessOk = index.max_age_ms <= 0 || staleness < index.max_age_ms;
    return { valid: hashValid && stalenessOk, staleness_ms: staleness };
  } catch { return { valid: false, staleness_ms: -1 }; }
}

function logTruthCheck(req: {
  data: string; data_class: string; source_hash: string;
  max_age_hours?: number; check_only?: boolean;
}): {
  passed: boolean; gate_version: string; data_class: string;
  staleness_ms: number; source_hash_valid: boolean; recommendation: string;
  blocked_planes: number[]; blocked_reason: string | null;
} {
  ensureDir();
  const maxAgeMs = (req.max_age_hours ?? 24) * 3600 * 1000;
  const dc = req.data_class as typeof DATA_CLASSES[number];

  // Step 1: Check if data_class is known
  if (!DATA_CLASSES.includes(dc)) {
    const logEntry = { ts: Date.now(), result: \'UNKNOWN_CLASS\', data_class: dc, data_preview: req.data.slice(0, 50) };
    writeFileSync(TRUTH_LOG, JSON.stringify(logEntry) + \'\n\', { flag: \'a\' });
    return {
      passed: false, gate_version: \'1.0\', data_class: dc,
      staleness_ms: -1, source_hash_valid: false,
      recommendation: \'BLOCK\',
      blocked_planes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      blocked_reason: \`Unknown data class: \${dc}\`,
    };
  }

  // Step 2: Source hash verification
  const hashValid = req.source_hash
    ? hashPayload(req.data) === req.source_hash
    : getStoredHash(dc) !== null && verifyHash(dc, req.data).valid;

  // Step 3: Staleness check
  const { staleness_ms } = verifyHash(dc, req.data);
  const stale = maxAgeMs > 0 && staleness_ms > maxAgeMs;

  // Step 4: PASS / WARN / BLOCK
  let passed = true;
  let recommendation = \'PASS\';
  let blockedReason: string | null = null;
  const blockedPlanes: number[] = [];

  if (!hashValid) {
    passed = false; recommendation = \'BLOCK\';
    blockedReason = \'Source hash mismatch — data may have been tampered with or not verified\';
    blockedPlanes.push(5, 9); // Fidelity + Governance planes
  } else if (stale) {
    passed = false; recommendation = \'BLOCK\';
    blockedReason = \`Data stale: \${Math.round(staleness_ms / 3600000)}h > \${Math.round(maxAgeMs / 3600000)}h max\`;
    blockedPlanes.push(1, 4, 7); // Temporality, Economic Value, Evolutionary
  }

  if (passed && !req.check_only) {
    storeHash(dc, req.data, maxAgeMs);
  }

  // Log the check
  const logEntry = {
    ts: Date.now(), result: recommendation, data_class: dc,
    hash_valid: hashValid, staleness_ms, stale,
    data_preview: req.data.slice(0, 50),
    blocked_planes: blockedPlanes,
  };
  writeFileSync(TRUTH_LOG, JSON.stringify(logEntry) + \'\n\', { flag: \'a\' });

  return {
    passed, gate_version: \'1.0\', data_class: dc,
    staleness_ms, source_hash_valid: hashValid,
    recommendation,
    blocked_planes: blockedPlanes,
    blocked_reason: blockedReason,
  };
}

function injectTruthHeader(result: {
  passed: boolean; recommendation: string; blocked_planes: number[];
  blocked_reason: string | null;
}, response: Record<string, unknown>): Record<string, unknown> {
  // Inject truth gate result into every LLM response
  return {
    _truth_gate: {
      version: \'1.0\',
      passed: result.passed,
      recommendation: result.recommendation,
      planes_blocked: result.blocked_planes,
      reason: result.blocked_reason,
      timestamp: Date.now(),
    },
    ...response,
  };
}

// Export for use in routes
export { verifyHash, hashPayload, logTruthCheck, injectTruthHeader, DATA_CLASSES, TRUTH_LOG };
export type { TruthGateResult };
