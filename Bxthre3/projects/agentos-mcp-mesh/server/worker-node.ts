#!/usr/bin/env bun
import { Hono } from "hono";
import { cors } from "hono/cors";

const CONTROL_PLANE = "https://mcp-mesh-control-plane-brodiblanco.zocomputer.io";
const MESH_SECRET = process.env.MESH_SECRET || "dev-secret";
const NODE_ID = process.env.NODE_ID || "worker-" + crypto.randomUUID().slice(0, 8);
const REGION = process.env.REGION || "us-central";
const PROVIDER = process.env.PROVIDER || "zo";
const PORT = 7778;

const metrics = { tasksRunning: 0, tasksCompleted: 0, tasksFailed: 0 };

const app = new Hono();
app.use("*", cors());

app.get("/health", (c) => c.json({
  nodeId: NODE_ID, healthy: true, metrics, uptime: process.uptime()
}));

app.post("/task", async (c) => {
  const task = await c.req.json();
  console.log(`[Worker] Received task: ${task.taskId}`);
  metrics.tasksRunning++;
  
  await new Promise(r => setTimeout(r, 1000));
  
  metrics.tasksRunning--;
  metrics.tasksCompleted++;
  
  return c.json({ success: true, taskId: task.taskId, result: { processed: true } });
});

async function register() {
  const endpoint = `http://localhost:${PORT}`;
  const res = await fetch(`${CONTROL_PLANE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Mesh-Token": MESH_SECRET },
    body: JSON.stringify({ nodeId: NODE_ID, endpoint, region: REGION, provider: PROVIDER })
  });
  return res.ok;
}

setInterval(async () => {
  await fetch(`${CONTROL_PLANE}/heartbeat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Mesh-Token": MESH_SECRET },
    body: JSON.stringify({ nodeId: NODE_ID, ...metrics })
  });
}, 15000);

console.log(`[Worker ${NODE_ID}] Starting...`);
console.log(`[Worker ${NODE_ID}] Control plane: ${CONTROL_PLANE}`);

register().then(ok => {
  if (ok) {
    console.log(`[Worker ${NODE_ID}] Registered`);
    Bun.serve({ fetch: app.fetch, port: PORT });
    console.log(`[Worker ${NODE_ID}] Listening on port ${PORT}`);
  } else {
    console.error(`[Worker ${NODE_ID}] Registration failed`);
  }
});
