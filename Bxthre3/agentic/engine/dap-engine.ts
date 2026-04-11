// Agentic v1 — 9-Plane Deterministic Assessment Protocol (DAP) Engine
import type { Context } from "hono";

export interface RealityVector {
  t: number; s_x: number; s_y: number;
  z_negative: number; z_positive: number;
  c: number; l: string; v_f: number; e: number; g: string;
}

export interface DAPPlane {
  id: number;
  name: string;
  description: string;
  threshold_fn: (v: RealityVector) => boolean;
  weight: number;
  fail_mode?: "block" | "warn" | "cascade";
}

export const DAP_PLANES: DAPPlane[] = [
  {
    id: 1, name: "temporality", weight: 0.05,
    description: "Timestamp validity — event must have a temporal anchor",
    threshold_fn: v => v.t > 0,
    fail_mode: "warn"
  },
  {
    id: 2, name: "spatiality", weight: 0.10,
    description: "Spatial context — geographic or abstract coordinate presence",
    threshold_fn: v => v.s_x !== 0 || v.s_y !== 0,
    fail_mode: "warn"
  },
  {
    id: 3, name: "compositional_lower", weight: 0.15,
    description: "Z-negative boundary — subsurface/resource depth indicator",
    threshold_fn: v => v.z_negative < -0.10,
    fail_mode: "cascade"
  },
  {
    id: 4, name: "economic_value", weight: 0.10,
    description: "Value-at-stake threshold — economic significance gate",
    threshold_fn: v => v.e >= 0,
    fail_mode: "warn"
  },
  {
    id: 5, name: "fidelity", weight: 0.20,
    description: "Confidence threshold — data quality gate (0.80 minimum)",
    threshold_fn: v => v.c >= 0.80,
    fail_mode: "block"
  },
  {
    id: 6, name: "execution_matrix", weight: 0.15,
    description: "Execution readiness — z_positive < z_negative indicates action needed",
    threshold_fn: v => v.z_positive < v.z_negative || v.z_positive < 0.25,
    fail_mode: "cascade"
  },
  {
    id: 7, name: "evolutionary", weight: 0.10,
    description: "Value fidelity growth — system improving",
    threshold_fn: v => v.v_f > 0.50,
    fail_mode: "warn"
  },
  {
    id: 8, name: "thermodynamic", weight: 0.05,
    description: "System entropy bound — always passes (placeholder for thermal/time decay)",
    threshold_fn: () => true,
    fail_mode: "warn"
  },
  {
    id: 9, name: "governance", weight: 0.10,
    description: "Compliance gate — must be COMPLIANT + APPROVED",
    threshold_fn: v => v.g === "APPROVED" && v.l === "COMPLIANT",
    fail_mode: "block"
  }
];

export interface DAPEvaluation {
  dap_version: string;
  planes_evaluated: number[];
  all_match: boolean;
  planes7to9_pass: boolean;
  planes7to9_required: boolean;
  final_state: "execute" | "block" | "cascade" | "warn";
  final_state_reason: string;
  plane_results: Record<number, {
    name: string; matched: boolean; weight: number;
    threshold_desc: string; fail_mode: string;
  }>;
  weighted_certainty: number;
  recommendation: string;
  blocked_planes: number[];
  cascaded_planes: number[];
}

export function evaluateDAP(vector: RealityVector): DAPEvaluation {
  const results: DAPEvaluation["plane_results"] = {};
  const blocked: number[] = [];
  const cascaded: number[] = [];
  let weighted_sum = 0;
  let total_weight = 0;

  for (const plane of DAP_PLANES) {
    const matched = plane.threshold_fn(vector);
    const threshold_desc = getThresholdDesc(plane.id, vector);
    
    results[plane.id] = {
      name: plane.name,
      matched,
      weight: plane.weight,
      threshold_desc,
      fail_mode: plane.fail_mode || "warn"
    };

    if (matched) {
      weighted_sum += plane.weight;
    }
    total_weight += plane.weight;

    if (!matched) {
      if (plane.fail_mode === "block") blocked.push(plane.id);
      else if (plane.fail_mode === "cascade") cascaded.push(plane.id);
    }
  }

  const planes7to9_pass = [7, 8, 9].every(id => results[id]?.matched);
  const all_match = Object.values(results).every(r => r.matched);
  const weighted_certainty = total_weight > 0 ? weighted_sum / total_weight : 0;

  let final_state: DAPEvaluation["final_state"];
  let final_state_reason: string;

  if (blocked.length > 0) {
    final_state = "block";
    final_state_reason = `Planes [${blocked.join(",")}] require blocking: ${blocked.map(id => results[id].name).join(", ")}`;
  } else if (cascaded.length > 0) {
    final_state = "cascade";
    final_state_reason = `Planes [${cascaded.join(",")}] triggered cascade mode`;
  } else if (!planes7to9_pass) {
    final_state = "warn";
    final_state_reason = "Governance planes (7-9) did not all pass — proceeding with warning";
  } else {
    final_state = "execute";
    final_state_reason = "All planes passed — execute with high certainty";
  }

  return {
    dap_version: "1.0",
    planes_evaluated: DAP_PLANES.map(p => p.id),
    all_match,
    planes7to9_pass,
    planes7to9_required: true,
    final_state,
    final_state_reason,
    plane_results: results,
    weighted_certainty: Math.round(weighted_certainty * 1000) / 1000,
    recommendation: final_state === "execute" ? "PROCEED" : final_state === "block" ? "DENY" : "REVIEW",
    blocked_planes: blocked,
    cascaded_planes: cascaded
  };
}

function getThresholdDesc(planeId: number, v: RealityVector): string {
  switch (planeId) {
    case 1: return `t=${v.t} > 0`;
    case 2: return `s_x=${v.s_x}, s_y=${v.s_y}`;
    case 3: return `z_negative=${v.z_negative} < -0.10`;
    case 4: return `e=${v.e} >= 0`;
    case 5: return `c=${v.c} >= 0.80`;
    case 6: return `z_positive=${v.z_positive} < ${Math.max(v.z_negative, 0.25)}`;
    case 7: return `v_f=${v.v_f} > 0.50`;
    case 8: return `always true (entropy bound)`;
    case 9: return `g=${v.g}, l=${v.l}`;
    default: return "";
  }
}

// Fast passthrough for Hono context (already-parsed input)
export function evaluateDAPFromBody(body: { vector: RealityVector; plane_results?: Record<number, boolean> }): DAPEvaluation {
  if (body.plane_results) {
    // Allow override of plane results for testing/flexibility
    return evaluateDAP(body.vector);
  }
  return evaluateDAP(body.vector);
}
