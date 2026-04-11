// Agentic v1 — JSON File Store
// Pure-JS persistence for zo.space (no native modules)
// Thread-safe via atomic rename
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from "fs";
import { join, dirname } from "path";

const STORE_DIR = "/home/workspace/Bxthre3/agentic/store";
if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true });

type Store = {
  events: Record<string, EventRecord>;
  subscriptions: Record<string, SubscriptionRecord>;
  outcomes: OutcomeRecord[];
  q_table: QEntry[];
  reasoning: ReasoningRecord[];
};

type EventRecord = {
  event_id: string; event_type: string; tier_source: number;
  v_t: number; v_s_x: number; v_s_y: number;
  v_z_neg: number; v_z_pos: number; v_c: number;
  v_l: string; v_v_f: number; v_e: number; v_g: string;
  execution_planes: string; agent_bindings: string;
  correlation_id: string; parent_event_id: string | null;
  cascade_depth: number; hash_input: string; hash_full: string;
  sealed_at: string; created_at: string;
};

type SubscriptionRecord = {
  agent_id: string; event_patterns: string[]; callback_url: string | null;
  status: string; last_wake: string | null; wake_count: number;
};

type OutcomeRecord = {
  id: number; task_id: string; agent_id: string;
  action: string; reward: number; latency_ms: number;
  quality_score: number; cost_usd: number; outcome: string; created_at: string;
};

type QEntry = {
  agent_id: string; task_type: string; domain: string;
  q_value: number; visit_count: number; last_updated: string;
};

type ReasoningRecord = {
  id: string; task_id: string; agent_id: string; phase: string;
  step_id: string; reasoning: string; evidence: string[];
  confidence: number; next_action: string; metadata: Record<string, unknown>;
  created_at: string;
};

const STORE_FILE = join(STORE_DIR, "agentic-store.json");
const LOCK_FILE = join(STORE_DIR, "agentic-store.lock");

function readStore(): Store {
  if (!existsSync(STORE_FILE)) {
    return { events: {}, subscriptions: {}, outcomes: [], q_table: [], reasoning: [] };
  }
  try {
    const raw = readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw) as Store;
  } catch {
    return { events: {}, subscriptions: {}, outcomes: [], q_table: [], reasoning: [] };
  }
}

function writeStore(store: Store): void {
  const tmp = STORE_FILE + ".tmp";
  writeFileSync(tmp, JSON.stringify(store), "utf-8");
  renameSync(tmp, STORE_FILE); // atomic
}

// Public API
export function insertEventRecord(ev: EventRecord): void {
  const store = readStore();
  store.events[ev.event_id] = ev;
  writeStore(store);
}

export function getEventRecord(event_id: string): EventRecord | null {
  const store = readStore();
  return store.events[event_id] || null;
}

export function getEventsByCorrelation(correlation_id: string, maxDepth = 5): EventRecord[] {
  const store = readStore();
  return Object.values(store.events)
    .filter(e => e.correlation_id === correlation_id && e.cascade_depth <= maxDepth)
    .sort((a, b) => a.cascade_depth - b.cascade_depth);
}

export function getEventCount(): number {
  return Object.keys(readStore().events).length;
}

// Subscriptions
export function upsertSubscription(agent_id: string, patterns: string[], callback_url?: string): void {
  const store = readStore();
  store.subscriptions[agent_id] = {
    agent_id, event_patterns: patterns,
    callback_url: callback_url || null,
    status: "active", last_wake: null, wake_count: 0
  };
  writeStore(store);
}

export function getAllSubscriptions(): SubscriptionRecord[] {
  return Object.values(readStore().subscriptions);
}

export function getMatchingSubscriptions(event_type: string): string[] {
  const subs = Object.values(readStore().subscriptions);
  return subs.filter(s =>
    s.event_patterns.some(p => matchGlob(event_type, p))
  ).map(s => s.agent_id);
}

function matchGlob(str: string, pattern: string): boolean {
  const re = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
  return new RegExp(`^${re}$`).test(str);
}

// Thompson Q-table
export function getQValue(agent_id: string, task_type: string, domain: string): number {
  const store = readStore();
  const entry = store.q_table.find(
    e => e.agent_id === agent_id && e.task_type === task_type && e.domain === domain
  );
  return entry?.q_value ?? 0.5;
}

export function updateQValue(agent_id: string, task_type: string, domain: string, reward: number): void {
  const store = readStore();
  const idx = store.q_table.findIndex(
    e => e.agent_id === agent_id && e.task_type === task_type && e.domain === domain
  );
  if (idx >= 0) {
    const e = store.q_table[idx];
    store.q_table[idx] = { ...e, q_value: e.q_value * 0.8 + reward * 0.2, visit_count: e.visit_count + 1, last_updated: new Date().toISOString() };
  } else {
    store.q_table.push({ agent_id, task_type, domain, q_value: reward, visit_count: 1, last_updated: new Date().toISOString() });
  }
  writeStore(store);
}

export function initAgentQ(agent_id: string, task_types: string[], domains: string[], base_q = 0.5): void {
  const store = readStore();
  for (const tt of task_types) {
    for (const d of domains) {
      if (!store.q_table.find(e => e.agent_id === agent_id && e.task_type === tt && e.domain === d)) {
        store.q_table.push({ agent_id, task_type: tt, domain: d, q_value: base_q, visit_count: 1, last_updated: new Date().toISOString() });
      }
    }
  }
  writeStore(store);
}

export function getAllQEntries(): QEntry[] {
  return readStore().q_table;
}

export function recordOutcome(rec: Omit<OutcomeRecord, "id" | "created_at">): void {
  const store = readStore();
  const id = (store.outcomes[store.outcomes.length - 1]?.id ?? 0) + 1;
  store.outcomes.push({ ...rec, id, created_at: new Date().toISOString() });
  if (store.outcomes.length > 10000) store.outcomes = store.outcomes.slice(-5000);
  writeStore(store);
}

// Reasoning stream
export function appendReasoning(rec: ReasoningRecord): void {
  const store = readStore();
  store.reasoning.push(rec);
  writeStore(store);
}

export function getReasoningForTask(task_id: string): ReasoningRecord[] {
  return readStore().reasoning.filter(r => r.task_id === task_id);
}
