// Agentic v1 — Event Store (SQLite)
// File-backed SQLite for zo.space compatibility
import Database from "better-sqlite3";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

const STORE_DIR = "/home/workspace/Bxthre3/agentic/store";
const DB_PATH = join(STORE_DIR, "agentic.db");

// Ensure directory exists
if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true });

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      event_id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      tier_source INTEGER CHECK(tier_source IN (1,2,3)),
      v_t INTEGER NOT NULL,
      v_s_x REAL, v_s_y REAL,
      v_z_neg REAL, v_z_pos REAL,
      v_c REAL CHECK(v_c BETWEEN 0 AND 1),
      v_l TEXT, v_v_f REAL, v_e INTEGER, v_g TEXT,
      execution_planes TEXT,
      agent_bindings TEXT,
      correlation_id TEXT NOT NULL,
      parent_event_id TEXT,
      cascade_depth INTEGER DEFAULT 0,
      hash_input TEXT NOT NULL,
      hash_full TEXT NOT NULL,
      sealed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
    CREATE INDEX IF NOT EXISTS idx_events_correlation ON events(correlation_id);
    CREATE INDEX IF NOT EXISTS idx_events_tier ON events(tier_source);
    CREATE INDEX IF NOT EXISTS idx_events_temporality ON events(v_t);
    CREATE INDEX IF NOT EXISTS idx_events_parent ON events(parent_event_id);

    CREATE TABLE IF NOT EXISTS agent_subscriptions (
      agent_id TEXT PRIMARY KEY,
      event_patterns TEXT NOT NULL,
      callback_url TEXT,
      auth_hash TEXT,
      status TEXT DEFAULT 'sleeping',
      last_wake TEXT,
      wake_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reasoning_stream (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      phase TEXT NOT NULL,
      step_id TEXT,
      reasoning TEXT NOT NULL,
      evidence TEXT NOT NULL DEFAULT '[]',
      confidence REAL NOT NULL,
      next_action TEXT DEFAULT '',
      metadata TEXT DEFAULT '{}',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS task_outcomes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      action TEXT NOT NULL,
      reward REAL NOT NULL,
      latency_ms INTEGER,
      quality_score REAL,
      cost_usd REAL,
      outcome TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agent_routing_q (
      agent_id TEXT NOT NULL,
      task_type TEXT NOT NULL,
      domain TEXT NOT NULL,
      q_value REAL DEFAULT 0.0,
      visit_count INTEGER DEFAULT 0,
      last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (agent_id, task_type, domain)
    );
  `);
}

export interface RealityVector {
  t: number; s_x: number; s_y: number;
  z_negative: number; z_positive: number;
  c: number; l: string; v_f: number; e: number; g: string;
}

export interface StoredEvent {
  event_id: string; event_type: string; tier_source: number;
  v_t: number; v_s_x: number; v_s_y: number;
  v_z_neg: number; v_z_pos: number; v_c: number;
  v_l: string; v_v_f: number; v_e: number; v_g: string;
  execution_planes: string; agent_bindings: string;
  correlation_id: string; parent_event_id: string | null;
  cascade_depth: number; hash_input: string; hash_full: string;
  sealed_at: string; created_at: string;
}

export function insertEvent(event: StoredEvent & { child_events?: StoredEvent[] }): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO events
      (event_id, event_type, tier_source, v_t, v_s_x, v_s_y, v_z_neg, v_z_pos, v_c, v_l, v_v_f, v_e, v_g,
       execution_planes, agent_bindings, correlation_id, parent_event_id, cascade_depth, hash_input, hash_full)
    VALUES
      (@event_id, @event_type, @tier_source, @v_t, @v_s_x, @v_s_y, @v_z_neg, @v_z_pos, @v_c, @v_l, @v_v_f, @v_e, @v_g,
       @execution_planes, @agent_bindings, @correlation_id, @parent_event_id, @cascade_depth, @hash_input, @hash_full)
  `);
  stmt.run(event);
  if (event.child_events) {
    for (const child of event.child_events) insertEvent(child);
  }
}

export function getEventById(event_id: string): StoredEvent | null {
  const db = getDb();
  return db.prepare("SELECT * FROM events WHERE event_id = ?").get(event_id) as StoredEvent | null;
}

export function getEventsByCorrelation(correlation_id: string, depth = 5): StoredEvent[] {
  const db = getDb();
  return db.prepare(
    "SELECT * FROM events WHERE correlation_id = ? AND cascade_depth <= ? ORDER BY created_at ASC"
  ).all(correlation_id, depth) as StoredEvent[];
}

export function getCascadeTree(event_id: string, maxDepth = 5): StoredEvent[] {
  const db = getDb();
  const events: StoredEvent[] = [];
  const queue: string[] = [event_id];
  const visited = new Set<string>();
  while (queue.length && events.length < 100) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const row = db.prepare("SELECT * FROM events WHERE event_id = ? OR parent_event_id = ?").get(id, id) as StoredEvent | undefined;
    if (row) {
      events.push(row);
      if (row.cascade_depth < maxDepth) queue.push(row.event_id);
    }
  }
  return events;
}

export function getEventCount(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM events").get() as { count: number };
  return row.count;
}

// Thompson Sampling Q-table
export function getQValue(agent_id: string, task_type: string, domain: string): number {
  const db = getDb();
  const row = db.prepare(
    "SELECT q_value FROM agent_routing_q WHERE agent_id=? AND task_type=? AND domain=?"
  ).get(agent_id, task_type, domain) as { q_value: number } | undefined;
  return row?.q_value ?? 0.0;
}

export function updateQValue(agent_id: string, task_type: string, domain: string, reward: number): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO agent_routing_q (agent_id, task_type, domain, q_value, visit_count, last_updated)
    VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT (agent_id, task_type, domain) DO UPDATE SET
      q_value = q_value * 0.8 + ? * 0.2,
      visit_count = visit_count + 1,
      last_updated = CURRENT_TIMESTAMP
  `).run(agent_id, task_type, domain, reward);
}

export function getAllQValues(): { agent_id: string; task_type: string; domain: string; q_value: number; visit_count: number }[] {
  const db = getDb();
  return db.prepare("SELECT * FROM agent_routing_q ORDER BY q_value DESC").all() as any[];
}

// Agent subscriptions
export function upsertSubscription(agent_id: string, patterns: string[], callback_url?: string): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO agent_subscriptions (agent_id, event_patterns, callback_url, status)
    VALUES (?, ?, ?, 'sleeping')
    ON CONFLICT (agent_id) DO UPDATE SET
      event_patterns = excluded.event_patterns,
      callback_url = excluded.callback_url,
      status = 'sleeping'
  `).run(agent_id, JSON.stringify(patterns), callback_url || null);
}

export function getSubscriptions(): { agent_id: string; event_patterns: string[]; callback_url: string; status: string; wake_count: number }[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM agent_subscriptions").all() as any[];
  return rows.map(r => ({ ...r, event_patterns: JSON.parse(r.event_patterns) }));
}

export function getMatchingSubscriptions(event_type: string): string[] {
  const subs = getSubscriptions();
  return subs
    .filter(s => matchPattern(event_type, s.event_patterns))
    .map(s => s.agent_id);
}

function matchPattern(event_type: string, patterns: string[]): boolean {
  for (const p of patterns) {
    const re = p.replace(/\./g, "\\.").replace(/\*/g, ".*");
    if (new RegExp(`^${re}$`).test(event_type)) return true;
  }
  return false;
}

export function recordOutcome(task_id: string, agent_id: string, action: string, reward: number, latency_ms: number, quality_score: number, cost_usd: number, outcome: string): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO task_outcomes (task_id, agent_id, action, reward, latency_ms, quality_score, cost_usd, outcome)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(task_id, agent_id, action, reward, latency_ms, quality_score, cost_usd, outcome);
}

export function getRecentOutcomes(limit = 100): any[] {
  const db = getDb();
  return db.prepare("SELECT * FROM task_outcomes ORDER BY created_at DESC LIMIT ?").all(limit);
}

// Reasoning stream
export function appendReasoning(id: string, task_id: string, agent_id: string, phase: string, step_id: string, reasoning: string, evidence: string[], confidence: number, next_action: string, metadata = {}): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO reasoning_stream (id, task_id, agent_id, phase, step_id, reasoning, evidence, confidence, next_action, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, task_id, agent_id, phase, step_id, reasoning, JSON.stringify(evidence), confidence, next_action, JSON.stringify(metadata));
}

export function getReasoningForTask(task_id: string): any[] {
  const db = getDb();
  return db.prepare("SELECT * FROM reasoning_stream WHERE task_id = ? ORDER BY created_at ASC").all(task_id);
}
