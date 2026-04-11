// Agentic v1 — Event Cascade Engine
// SFD → PMT → DHU → RSS tier flow with child event emission
import { createHash } from "crypto";
import { randomUUID } from "crypto";
import { insertEvent, getMatchingSubscriptions, type RealityVector, type StoredEvent } from "../store/event-store";
import { evaluateDAP, type DAPEvaluation } from "../engine/dap-engine";

const TIER_MAP: Record<string, 1 | 2 | 3>> = {
  sfd: 1, rss: 1, usr: 1, fin: 1, inv: 1,
  sys: 2, cha: 2, met: 2, dap: 2,
  agt: 3, syn: 3, pmt: 3, dhu: 3, rss: 3
};

const CASCADE_RULES: Record<string, string[][]> = {
  sfd: [["pmt", "dhu"], ["rss"]],
  rss: [["pmt"]],
  sys: [["agt"]],
  cha: [["agt", "syn"]],
  met: [["agt"]],
  agt: [["syn"]],
  pmt: [["dhu", "rss"]],
  dhu: [["rss"]],
  syn: [],
  usr: [["sys", "agt"]],
  fin: [["dhu", "rss"]],
  inv: [["dhu", "rss"]],
};

const MAX_CASCADE_DEPTH = 5;

function deriveTier(event_type: string): 1 | 2 | 3 {
  const prefix = event_type.split(".")[0];
  return TIER_MAP[prefix] || 2;
}

function generateChildEvents(
  parent_type: string,
  parent_id: string,
  correlation_id: string,
  depth: number
): { event_type: string; tier: 1 | 2 | 3; depth: number }[] {
  if (depth >= MAX_CASCADE_DEPTH) return [];
  const prefix = parent_type.split(".")[0];
  const rules = CASCADE_RULES[prefix];
  if (!rules || rules.length === 0) return [];
  const children: { event_type: string; tier: 1 | 2 | 3; depth: number }[] = [];
  for (let i = 0; i < rules.length; i++) {
    const child_prefix = rules[i][0];
    const child_tier = TIER_MAP[child_prefix] || 2;
    children.push({ event_type: `${child_prefix}.cascade.child`, tier: child_tier, depth: depth + 1 });
  }
  return children;
}

function makeHash(...parts: string[]): string {
  const input = parts.join("|");
  let h = createHash("sha3-256");
  h.update(input);
  return h.digest("hex");
}

export interface CascadeResult {
  event_id: string; event_type: string; tier: number;
  cascade_depth: number; dap_evaluation: DAPEvaluation;
  child_events: { event_id: string; event_type: string; tier: number; depth: number }[];
  agents_triggered: string[]; forensic: { created_at: string; sealed: boolean; hash_prefix: string };
  metadata: { correlation_id: string; ancestry_hash: string };
}

export function ingestEvent(
  event_type: string,
  vector: RealityVector,
  metadata: { correlation_id?: string; session_id?: string } = {}
): CascadeResult {
  const correlation_id = metadata.correlation_id || randomUUID();
  const tier = deriveTier(event_type);
  const event_id = randomUUID();
  const created_at = new Date().toISOString();
  
  // DAP evaluation
  const dap_evaluation = evaluateDAP(vector);
  
  // Build ancestry hash
  const ancestry_hash = makeHash(event_id, event_type, correlation_id, created_at);
  
  // Generate child events
  const childDefns = generateChildEvents(event_type, event_id, correlation_id, 0);
  const child_events = childDefns.map(d => ({
    event_id: randomUUID(),
    event_type: d.event_type,
    tier: d.tier,
    depth: d.depth
  }));
  
  // Store parent event
  const parentEvent: StoredEvent = {
    event_id, event_type, tier_source: tier, v_t: vector.t, v_s_x: vector.s_x, v_s_y: vector.s_y,
    v_z_neg: vector.z_negative, v_z_pos: vector.z_positive, v_c: vector.c,
    v_l: vector.l, v_v_f: vector.v_f, v_e: vector.e, v_g: vector.g,
    execution_planes: JSON.stringify(dap_evaluation.planes_evaluated),
    agent_bindings: JSON.stringify(dap_evaluation.blocked_planes.length > 0 ? [] : child_events.map(c => c.event_id)),
    correlation_id, parent_event_id: null, cascade_depth: 0,
    hash_input: [event_id, event_type, correlation_id, created_at].join("|"),
    hash_full: ancestry_hash, sealed_at: created_at, created_at
  };
  insertEvent(parentEvent);
  
  // Store child events
  for (const child of child_events) {
    const childHash = makeHash(child.event_id, child.event_type, correlation_id, ancestry_hash);
    const childEvent: StoredEvent = {
      event_id: child.event_id, event_type: child.event_type, tier_source: child.tier,
      v_t: vector.t, v_s_x: vector.s_x, v_s_y: vector.s_y,
      v_z_neg: vector.z_negative, v_z_pos: vector.z_positive, v_c: vector.c,
      v_l: vector.l, v_v_f: vector.v_f, v_e: vector.e, v_g: vector.g,
      execution_planes: JSON.stringify([]), agent_bindings: JSON.stringify([]),
      correlation_id, parent_event_id: event_id, cascade_depth: child.depth,
      hash_input: [child.event_id, child.event_type, correlation_id, ancestry_hash].join("|"),
      hash_full: childHash, sealed_at: created_at, created_at
    };
    insertEvent(childEvent);
  }
  
  // Find matching agents
  const agents = getMatchingSubscriptions(event_type);
  
  return {
    event_id, event_type, tier, cascade_depth: child_events.length,
    dap_evaluation, child_events,
    agents_triggered: agents,
    forensic: { created_at, sealed: true, hash_prefix: ancestry_hash.slice(0, 12) },
    metadata: { correlation_id, ancestry_hash }
  };
}
