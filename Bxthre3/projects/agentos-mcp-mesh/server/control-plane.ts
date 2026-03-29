#!/usr/bin/env bun
/**
 * MCP Mesh Control Plane Server
 * Always-on with persistent state
 */

import { Hono } from "hono";
import { cors } from "hono/cors";

interface MeshNode {
  nodeId: string;
  endpoint: string;
  region: string;
  provider: string;
  healthy: boolean;
  lastSeen: number;
  tasksRunning: number;
  tasksCompleted: number;
  capabilities: string[];
  maxTasks: number;
}

interface Task {
  taskId: string;
  type: string;
  payload: any;
  status: "queued" | "running" | "completed" | "failed";
  assignedTo?: string;
  result?: any;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

const nodes = new Map<string, MeshNode>();
const tasks = new Map<string, Task>();
const taskQueue: string[] = [];
const MESH_SECRET = process.env.MESH_API_SECRET || "dev-secret";

// Health pruner
setInterval(() => {
  const now = Date.now();
  let pruned = 0;
  for (const [id, node] of nodes) {
    if (now - node.lastSeen > 60000) {
      node.healthy = false;
      pruned++;
    }
  }
  if (pruned > 0) console.log(`[Mesh] Pruned ${pruned} stale nodes`);
}, 30000);

// Task scheduler
setInterval(() => {
  if (taskQueue.length === 0) return;
  
  const healthyNodes = Array.from(nodes.values()).filter(n => n.healthy && n.tasksRunning < n.maxTasks);
  if (healthyNodes.length === 0) return;
  
  for (let i = 0; i < taskQueue.length && i < healthyNodes.length; i++) {
    const taskId = taskQueue.shift();
    if (!taskId) continue;
    
    const node = healthyNodes[i % healthyNodes.length];
    const task = tasks.get(taskId);
    if (!task) continue;
    
    task.status = "running";
    task.assignedTo = node.nodeId;
    task.startedAt = Date.now();
    node.tasksRunning++;
    
    console.log(`[Scheduler] Task ${taskId} → ${node.nodeId}`);
  }
}, 5000);

const app = new Hono();
app.use("*", cors());

const auth = async (c: any, next: any) => {
  const token = c.req.header("X-Mesh-Token");
  if (token !== MESH_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
};

// Public status
app.get("/status", (c) => {
  const now = Date.now();
  const nodeList = Array.from(nodes.values());
  const healthy = nodeList.filter(n => n.healthy);
  
  return c.json({
    status: "active",
    timestamp: new Date().toISOString(),
    mesh: {
      totalNodes: nodes.size,
      healthyNodes: healthy.length,
      unhealthyNodes: nodes.size - healthy.length,
      totalTasks: tasks.size,
      pending: taskQueue.length,
      running: nodeList.reduce((s, n) => s + n.tasksRunning, 0),
      completed: nodeList.reduce((s, n) => s + n.tasksCompleted, 0)
    },
    nodes: nodeList.map(n => ({
      nodeId: n.nodeId,
      endpoint: n.endpoint,
      region: n.region,
      provider: n.provider,
      healthy: n.healthy,
      lastSeen: Math.floor((now - n.lastSeen) / 1000) + "s ago",
      running: n.tasksRunning,
      completed: n.tasksCompleted
    }))
  });
});

// Protected register
app.post("/register", auth, async (c) => {
  const body = await c.req.json();
  const { nodeId, endpoint, region, provider, capabilities = [] } = body;
  
  if (!nodeId || !endpoint) {
    return c.json({ error: "Missing nodeId or endpoint" }, 400);
  }
  
  const isNew = !nodes.has(nodeId);
  nodes.set(nodeId, {
    nodeId, endpoint,
    region: region || "unknown",
    provider: provider || "unknown",
    healthy: true, lastSeen: Date.now(),
    tasksRunning: 0, tasksCompleted: 0, capabilities,
    maxTasks: body.maxTasks || 3
  });
  
  console.log(`[Mesh] Node ${isNew ? "registered" : "updated"}: ${nodeId}`);
  return c.json({ success: true, nodeId, nodesInMesh: nodes.size });
});

// Protected heartbeat
app.post("/heartbeat", auth, async (c) => {
  const body = await c.req.json();
  const node = nodes.get(body.nodeId);
  if (!node) return c.json({ error: "Node not found" }, 404);
  
  node.lastSeen = Date.now();
  node.healthy = true;
  node.tasksRunning = body.tasksRunning || node.tasksRunning;
  node.tasksCompleted = body.tasksCompleted || node.tasksCompleted;
  
  return c.json({ ok: true, nodeId: body.nodeId });
});

// Protected submit task
app.post("/tasks/submit", auth, async (c) => {
  const body = await c.req.json();
  const taskId = crypto.randomUUID();
  
  const task: Task = {
    taskId, type: body.type || "generic",
    payload: body.payload || {},
    status: "queued", createdAt: Date.now()
  };
  
  tasks.set(taskId, task);
  taskQueue.push(taskId);
  console.log(`[Task] Queued: ${taskId}`);
  
  return c.json({ queued: true, taskId, position: taskQueue.length });
});

// Protected complete task
app.post("/tasks/complete", auth, async (c) => {
  const body = await c.req.json();
  const task = tasks.get(body.taskId);
  
  if (!task) return c.json({ error: "Task not found" }, 404);
  if (task.assignedTo !== body.nodeId) {
    return c.json({ error: "Not assigned to you" }, 403);
  }
  
  task.status = body.error ? "failed" : "completed";
  task.result = body.result;
  task.completedAt = Date.now();
  
  const node = nodes.get(body.nodeId);
  if (node) {
    node.tasksRunning = Math.max(0, node.tasksRunning - 1);
    if (!body.error) node.tasksCompleted++;
  }
  
  return c.json({ ok: true, taskId: body.taskId });
});

// Start server
const PORT = process.env.PORT || 7777;
console.log(`[ControlPlane] Starting on port ${PORT}`);
Bun.serve({ fetch: app.fetch, port: PORT });
