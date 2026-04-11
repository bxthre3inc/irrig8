// Agentic v1 — SQLite Event Store via sql.js (WASM, no native modules)
// Pure JS SQLite for zo.space environment
import initSqlJs, { Database } from "sql.js";

const SQL: any = await initSqlJs({ locateFile: (f: string) => `https://sql.js.org/dist/${f}` });

// DB file path in /dev/shm (persists across requests, cleared on server restart)
const DB_PATH = "/dev/shm/agentic_events.db";
const WAL_PATH = "/dev/shm/agentic_events.wal";

let _db: Database | null = null;
let _initPromise: Promise<Database> | null = null;

async function getDb(): Promise<Database> {
  if (_db) return _db;
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    const db = new SQL.Database();
    // WAL mode for durability
    db.run("PRAGMA journal_mode=WAL");
    db.run("PRAGMA synchronous=NORMAL");
    db.run("PRAGMA cache_size=10000");
    db.run("PRAGMA temp_store=MEMORY");
    // Events table
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        event_id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        tier_source INTEGER NOT NULL CHECK(tier_source IN(1,2,3)),
        v_t INTEGER NOT NULL,
        v_s_x REAL,
        v_s_y REAL,
        v_z_neg REAL,
        v_z_pos REAL,
        v_c REAL CHECK(v_c BETWEEN 0.0 AND 1.0),
        v_l TEXT,
        v_v_f REAL,
        v_e INTEGER,
        v_g TEXT,
        execution_planes TEXT,
        agent_bindings TEXT,
        correlation_id TEXT NOT NULL,
        parent_event_id TEXT,
        cascade_depth INTEGER DEFAULT 0,
        hash_input TEXT NOT NULL,
        hash_full TEXT NOT NULL,
        sealed_at TEXT DEFAULT (datetime('now')),
        raw_json TEXT NOT NULL
      )
    `);
    // Agent subscriptions
    db.run(`
      CREATE TABLE IF NOT EXISTS agent_subscriptions (
        agent_id TEXT PRIMARY KEY,
        subscriptions TEXT NOT NULL,
        dap_planes TEXT DEFAULT '[]',
        execution_mode TEXT DEFAULT 'auto',
        status TEXT DEFAULT 'sleeping',
        last_wake TEXT,
        wake_count INTEGER DEFAULT 0,
        registered_at TEXT DEFAULT (datetime('now'))
      )
    `);
    // Thompson Sampling Q-table
    db.run(`
      CREATE TABLE IF NOT EXISTS thompson_q (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id TEXT NOT NULL,
        task_type TEXT NOT NULL,
        successes INTEGER DEFAULT 0,
        failures INTEGER DEFAULT 0,
        alpha REAL DEFAULT 1.0,
        beta REAL DEFAULT 1.0,
        total_reward REAL DEFAULT 0.0,
        last_updated TEXT DEFAULT (datetime('now')),
        UNIQUE(agent_id, task_type)
      )
    `);
    // SEM proposals
    db.run(`
      CREATE TABLE IF NOT EXISTS sem_proposals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        proposal_id TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        target_file TEXT NOT NULL,
        patch_content TEXT NOT NULL,
        proposer TEXT NOT NULL,
        phase TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        sandbox_output TEXT,
        committed_at TEXT,
        rollback_from TEXT
      )
    `);
    // Cascade log
    db.run(`
      CREATE TABLE IF NOT EXISTS cascade_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        root_event_id TEXT NOT NULL,
        depth INTEGER NOT NULL,
        event_count INTEGER NOT NULL,
        agents_triggered TEXT,
        dap_result TEXT,
        completed_at TEXT
      )
    `);
    // Indexes
    db.run("CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type)");
    db.run("CREATE INDEX IF NOT EXISTS idx_events_correlation ON events(correlation_id)");
    db.run("CREATE INDEX IF NOT EXISTS idx_events_tier ON events(tier_source)");
    db.run("CREATE INDEX IF NOT EXISTS idx_events_t ON events(v_t DESC)");
    db.run("CREATE INDEX IF NOT EXISTS idx_events_parent ON events(parent_event_id)");
    _db = db;
    console.log("[agentic] SQLite DB initialized at", DB_PATH);
    return db;
  })();
  return _initPromise;
}

function saveDb(db: Database): void {
  try {
    const data = db.export();
    const buf = Buffer.from(data);
    require("fs").writeFileSync(DB_PATH, buf);
  } catch (e) {
    console.error("[agentic] DB save failed:", e);
  }
}

export { getDb, saveDb, DB_PATH };
export default { getDb, saveDb };
