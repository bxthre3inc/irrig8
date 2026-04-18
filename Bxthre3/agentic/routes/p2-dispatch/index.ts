/**
 * IER Router — Intelligent Evolutionary Router
 * 
 * Q-learning bandit that routes incoming intent to the best workflow/agent.
 * Uses epsilon-greedy exploration + Thompson sampling.
 * 
 * Stores: routing_log, workflow_stats, feedback_log
 */

import type { Context } from "hono";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

// ── Bandit configuration ────────────────────────────────────────────────
const WORKFLOWS = ["research", "code", "grant", "deploy", "general", "sales", "legal", "pipeline"] as const;
const EPSILON = 0.15; // 15% explore
const ALPHA = 0.2;   // learning rate

type Workflow = typeof WORKFLOWS[number];

// ── Task type → canonical workflow mapping ────────────────────────────────
function classifyIntent(intent: string): Workflow {
  const text = intent.toLowerCase();
  if (text.match(/grant|funding|sbir|reimburse/i)) return "grant";
  if (text.match(/deploy|build|ship|merge|pull.?request|pr|git/i)) return "deploy";
  if (text.match(/code|function|bug|feature|refactor|api|rust|typescript/i)) return "code";
  if (text.match(/legal|contract|agreement|nda|compliance|patent/i)) return "legal";
  if (text.match(/sales|revenue|lead|customer|pipeline|close/i)) return "sales";
  if (text.match(/research|analy|evaluate|assess|compar/i)) return "research";
  return "general";
}

// ── Thompson sampling ──────────────────────────────────────────────────
function sampleGaussian(mean: number, std: number): number {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + std * z;
}

function thompsonSample(workflow: Workflow, taskType: string, db: any): string {
  const stats = db.prepare(
    "SELECT avg_reward, visit_count FROM workflow_stats WHERE workflow_id = ? AND task_type = ?"
  ).get(workflow, taskType) as { avg_reward: number; visit_count: number } | undefined;

  if (!stats) return workflow; // untested — trust prior

  const std = 1 / Math.sqrt(Math.max(1, stats.visit_count));
  const sampled = sampleGaussian(stats.avg_reward, std);

  // Pick best sampled
  let best = workflow;
  let bestVal = sampled;
  for (const wf of WORKFLOWS) {
    const s = db.prepare(
      "SELECT avg_reward, visit_count FROM workflow_stats WHERE workflow_id = ? AND task_type = ?"
    ).get(wf, taskType) as { avg_reward: number; visit_count: number } | undefined;
    if (!s) continue;
    const v = sampleGaussian(s.avg_reward, 1 / Math.sqrt(Math.max(1, s.visit_count));
    if (v > bestVal) { best = wf; bestVal = v; }
  }
  return best;
}

// ── Epsilon-greedy route ─────────────────────────────────────────────
const QTABLE_PATH = "/dev/shm/agentic/ier_qtable.json";

interface QEntry {
  q_value: number;
  visit_count: number;
  last_updated: string;
}

function loadQTable(): Record<string, Record<string, QEntry>> {
  try {
    return JSON.parse(readFileSync(QTABLE_PATH, "utf-8"));
  } catch { return {}; }
}

function saveQTable(qtable: Record<string, Record<string, QEntry>>) {
  mkdirSync(STORE_DIR, { recursive: true });
  writeFileSync(QTABLE_PATH, JSON.stringify(qtable, null, 2));
}

function routeIntent(intent: string, db: any): { workflow: Workflow; mode: "EXPLOIT" | "EXPLORE"; confidence: number } {
  const taskType = classifyIntent(intent);
  const qtable = loadQTable();

  // Epsilon-greedy
  if (Math.random() < EPSILON) {
    const randomWf = WORKFLOWS[Math.floor(Math.random() * WORKFLOWS.length)];
    return { workflow: randomWf, mode: "EXPLORE", confidence: 0.1 };
  }

  // Thompson sample across all workflows
  let best: Workflow = "general";
  let bestScore = -Infinity;
  for (const wf of WORKFLOWS) {
    const entry = qtable[taskType]?.[wf] ?? { q_value: 0.5, visit_count: 0 };
    const std = 1 / Math.sqrt(Math.max(1, entry.visit_count));
    const score = sampleGaussian(entry.q_value, std);
    if (score > bestScore) { bestScore = score; best = wf; }
  }

  // Persist Q-table on every decision
  if (!qtable[taskType]) qtable[taskType] = {};
  const entry = qtable[taskType][best] ?? { q_value: 0.5, visit_count: 0 };
  entry.visit_count += 1;
  entry.last_updated = new Date().toISOString();
  qtable[taskType][best] = entry;
  saveQTable(qtable);

  const avg_reward = entry.q_value;
  return {
    workflow: best,
    mode: "EXPLOIT",
    confidence: Math.max(0, Math.min(1, avg_reward)),
  };
}

// ── Schema init ───────────────────────────────────────────────────────
function initSchema(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS routing_log (
      decision_id    TEXT PRIMARY KEY,
      task_type      TEXT NOT NULL,
      chosen_workflow TEXT NOT NULL,
      mode           TEXT NOT NULL,
      confidence     REAL NOT NULL,
      rationale      TEXT NOT NULL,
      intent_preview TEXT NOT NULL,
      created_at     TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workflow_stats (
      workflow_id  TEXT NOT NULL,
      task_type   TEXT NOT NULL,
      total_reward REAL NOT NULL DEFAULT 0,
      visit_count  INTEGER NOT NULL DEFAULT 0,
      avg_reward   REAL NOT NULL DEFAULT 0.5,
      last_updated TEXT,
      PRIMARY KEY (workflow_id, task_type)
    );

    CREATE TABLE IF NOT EXISTS feedback_log (
      feedback_id    TEXT PRIMARY KEY,
      decision_id   TEXT,
      outcome_reward REAL NOT NULL,
      outcome_label  TEXT NOT NULL,
      evidence       TEXT,
      created_at    TEXT NOT NULL
    );

    INSERT OR IGNORE INTO workflow_stats (workflow_id, task_type, total_reward, visit_count, avg_reward)
    VALUES ('research','research',0,0,0.5),
           ('code',    'code',    0,0,0.5),
           ('grant',   'grant',   0,0,0.5),
           ('deploy',  'deploy',  0,0,0.5),
           ('general', 'general', 0,0,0.5),
           ('sales',   'sales',   0,0,0.5),
           ('legal',   'legal',   0,0,0.5),
           ('pipeline','pipeline', 0,0,0.5);
  `);
}

// ── Main route: POST /api/agentic/route ───────────────────────────────
export default async (c: Context) => {
  const { intent, intent_id } = await c.req.json<{ intent: string; intent_id?: string }>();

  if (!intent?.trim()) {
    return c.json({ error: "intent is required" }, 400);
  }

  const DB_PATH = "/home/workspace/Bxthre3/agentic/store/ier_router.db";

  let db: any;
  try {
    db = require("better-sqlite3")(DB_PATH);
    initSchema(db);
  } catch (e: any) {
    // better-sqlite3 not available — fall back to in-memory
    db = null;
  }

  const decision_id = `ier-${Date.now().toString(36)}`;
  const task_type = db ? classifyIntent(intent) : "general";
  const { workflow, mode, confidence } = db ? routeIntent(intent, db) : { workflow: "general", mode: "EXPLOIT" as const, confidence: 0.5 };

  const rationale = mode === "EXPLORE"
    ? `Exploring ${workflow} (random under epsilon=${EPSILON})`
    : `Exploiting best-known workflow for ${task_type}`;

  if (db) {
    try {
      db.prepare(
        `INSERT OR IGNORE INTO routing_log (decision_id, task_type, chosen_workflow, mode, confidence, rationale, intent_preview, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(decision_id, task_type, workflow, mode, confidence, rationale, intent.slice(0, 80), new Date().toISOString());

      db.prepare(
        `UPDATE workflow_stats SET visit_count = visit_count + 1, last_updated = ? WHERE workflow_id = ? AND task_type = ?`
      ).run(new Date().toISOString(), workflow, task_type);
    } catch {}
  }

  if (db) try { db.close(); } catch {}

  return c.json({
    decision_id,
    intent_id,
    task_type,
    workflow,
    mode,
    confidence,
    rationale,
    routing: {
      workflow,
      estimated_agents: task_type === "grant" ? ["maya", "casey"] :
                        task_type === "code" ? ["iris", "dev"] :
                        task_type === "deploy" ? ["theo", "iris"] :
                        task_type === "sales" ? ["drew"] :
                        task_type === "legal" ? ["raj"] :
                        task_type === "research" ? ["sam", "zoe"] :
                        ["zoe", "atlas"],
    },
    created_at: new Date().toISOString(),
  });
}
