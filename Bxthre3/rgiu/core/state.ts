// RGIU State Management - SQLite via Bun
import { Database } from "bun:sqlite";
import type { State as IState } from "./types.ts";

export class State implements IState {
  private db: Database;

  constructor(path: string) {
    this.db = new Database(path);
    this.init();
  }

  private init() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        address TEXT NOT NULL,
        city TEXT,
        county TEXT,
        state TEXT,
        zip TEXT,
        assessed_value INTEGER,
        market_value INTEGER,
        tax_status TEXT,
        last_sale_date TEXT,
        sqft INTEGER,
        year_built INTEGER,
        condition TEXT,
        score REAL DEFAULT 0,
        status TEXT DEFAULT 'new',
        created_at TEXT,
        updated_at TEXT,
        raw_data TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_properties_score ON properties(score DESC);
      CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

      CREATE TABLE IF NOT EXISTS valuations (
        id TEXT PRIMARY KEY,
        property_id TEXT,
        method TEXT,
        estimated_market_value INTEGER,
        estimated_repair_cost INTEGER,
        max_offer_price INTEGER,
        confidence REAL,
        created_at TEXT,
        FOREIGN KEY (property_id) REFERENCES properties(id)
      );

      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        type TEXT,
        name TEXT,
        email TEXT,
        phone TEXT,
        criteria TEXT,
        status TEXT DEFAULT 'new',
        source TEXT,
        score INTEGER DEFAULT 0,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent TEXT,
        type TEXT,
        payload TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS fees (
        id TEXT PRIMARY KEY,
        type TEXT,
        amount INTEGER,
        status TEXT DEFAULT 'pending',
        source TEXT,
        created_at TEXT,
        paid_at TEXT
      );
    `);
  }

  query(sql: string, params: unknown[] = []): unknown[] {
    return this.db.query(sql).all(params);
  }

  exec(sql: string, params: unknown[] = []): void {
    this.db.run(sql, params);
  }

  get(sql: string, params: unknown[] = []): unknown {
    return this.db.query(sql).get(params);
  }
}
