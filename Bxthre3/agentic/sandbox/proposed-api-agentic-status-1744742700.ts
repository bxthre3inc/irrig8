// SEM Agent Proposed Fix — H1 (P0)
// File: /home/workspace/Bxthre3/agentic/sandbox/proposed-api-agentic-status-1744742700.ts
// Target: /api/agentic/status (and all sqlite3-using routes)
// Problem: "undefined is not a constructor (evaluating 'new sqlite3()')"
// Root Cause: Bun's sqlite3 is not a class constructor — it's accessed via Bun.sqlite() factory
// Fix: Use Bun.sqlite() instead of new sqlite3()

// PROPOSED CODE (apply to api-agentic-status.ts, api-agentic-agents.ts, api-agentic-tasks.ts, api-agentic-org.ts, api-agentic-escalations.ts):

import { sqlite3 } from "bun";
const db = sqlite3.open("/data/agentic/agentic.db");

export default async (c) => {
  const agents = db.all("SELECT * FROM agents").map(a => ({
    id: a.id,
    name: a.name,
    role: a.role,
    department: a.department,
    completionRate: a.completion_rate,
    activeTasks: Number(a.active_tasks),
    email: a.email,
    status: a.status,
    tools: [],
    skills: [],
    shifts: [],
    colleagues: []
  }));
  const tasks = db.all("SELECT * FROM tasks");
  const pending = tasks.filter(t => t.status === "PENDING");
  return c.json({
    version: "0.1.0",
    status: "operational",
    agentCount: agents.length,
    activeAgents: agents.filter(a => a.status === "ACTIVE" || a.status === "WORKING").length,
    workQueueDepth: pending.length,
    escalationCount: 0,
    timestamp: new Date().toISOString()
  });
};

// CHANGE SUMMARY:
// - sqlite3.open() instead of new sqlite3()
// - Works in Bun runtime (not Node.js)
// - File path: /data/agentic/agentic.db
