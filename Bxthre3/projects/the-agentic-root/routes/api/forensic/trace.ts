import type { Context } from "hono";

const EVENTS = [
  { plane: "purpose", action: "AUTHORIZE", msg: "Goal authorized: optimize water usage for Sector 7", ts: new Date().toISOString() },
  { plane: "bounds", action: "PROPOSE", msg: "Proposal: increase flow by 12% based on soil moisture + satellite", ts: new Date().toISOString() },
  { plane: "fact", action: "APPROVE", msg: "Validated: within hard constraints (flow rate, timing window)", ts: new Date().toISOString() },
  { plane: "fact", action: "LEDGER", msg: "Forensic entry written — purpose=bounds=fact triple confirmation", ts: new Date().toISOString() },
  { plane: "purpose", action: "ESCALATE", msg: "Boundary condition encountered — requesting human confirmation", ts: new Date().toISOString() },
  { plane: "bounds", action: "BAILOUT", msg: "State conflict unresolvable within bounds — escalating to human root", ts: new Date().toISOString() },
];

const LIVE_EVENTS = [
  { event_id: "evt_001", plane: "purpose", action: "AUTHORIZE", msg: "Goal authorized: irrigation schedule Q2", ts: new Date().toISOString() },
  { event_id: "evt_002", plane: "bounds", action: "PROPOSE", msg: "Bounds proposes: 3.2cm/day for Zone A3", ts: new Date().toISOString() },
  { event_id: "evt_003", plane: "fact", action: "APPROVE", msg: "Hard constraint check: PASS (within SLO thresholds)", ts: new Date().toISOString() },
  { event_id: "evt_004", plane: "fact", action: "HARD_BLOCK", msg: "Bounds request exceeds Tier-2 data resolution — Spatial Firewall triggered", ts: new Date().toISOString() },
  { event_id: "evt_005", plane: "bounds", action: "ESCALATE", msg: "Block reason: unauthorized data tier — routing to Purpose", ts: new Date().toISOString() },
  { event_id: "evt_006", plane: "fact", action: "LEDGER", msg: "Triple-plane ledger: AUTHORIZE→PROPOSE→HARD_BLOCK complete", ts: new Date().toISOString() },
];

export default async (c: Context) => {
  const seed = Math.floor(Date.now() / 8000) % LIVE_EVENTS.length;
  const count = Math.min(LIVE_EVENTS.length, 6);
  const events = LIVE_EVENTS.slice(seed, seed + count);
  return c.json({ events, count, ts: new Date().toISOString() });
};
