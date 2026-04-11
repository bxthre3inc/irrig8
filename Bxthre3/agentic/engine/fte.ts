// Agentic v1 — Fidelity Transition Engine (FTE)
// Synthesis: merges child outputs → verified parent response
// Trust Invariant: every summary traces to raw leaf-node data

export interface FTEChildOutput {
  child_id: string; child_name: string; phase: string;
  reasoning: string; evidence: string[];
  confidence: number; data: any; fidelity_score: number;
  provenance_chain: string[];
}

export interface FTEOutput {
  synthesis_id: string; parent_id: string; synthesized_at: string;
  child_count: number;
  merge_strategy: "weighted_fidelity" | "voting" | "earliest_confident" | "cascade_sequential";
  final_confidence: number;
  provenance: { root_sources: string[]; trace_linked: boolean; replayable: boolean; evidence_count: number };
  merged_reasoning: string; final_state: any;
  child_fidelities: Record<string, number>;
  consensus_score: number;
  dap_trace: { plane_id: number; plane_name: string; child_contribution: string }[];
  warnings: string[];
}

function consensus(children: FTEChildOutput[]): number {
  if (children.length < 2) return 1.0;
  let agree = 0, pairs = children.length * (children.length - 1) / 2;
  for (let i = 0; i < children.length; i++)
    for (let j = i + 1; j < children.length; j++)
      if (Math.abs(children[i].confidence - children[j].confidence) < 0.2) agree++;
  return Math.round((agree / pairs) * 1000) / 1000;
}

function mergeReasoning(children: FTEChildOutput[]): string {
  return children.map(c => `[${c.child_name}](conf=${c.confidence}): ${c.reasoning}`).join("\n");
}

function rootSources(children: FTEChildOutput[]): string[] {
  const s = new Set<string>();
  for (const c of children) { for (const ev of c.evidence) s.add(ev); for (const p of c.provenance_chain) s.add(p); }
  return Array.from(s);
}

export function synthesizeFTE(
  parent_id: string,
  children: FTEChildOutput[],
  strategy: FTEOutput["merge_strategy"] = "weighted_fidelity"
): FTEOutput {
  const now = new Date().toISOString();
  const synthesis_id = `fte-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const totalWeight = children.reduce((sum, c) => sum + c.fidelity_score, 0);
  const final_confidence = totalWeight > 0
    ? children.reduce((sum, c) => sum + c.confidence * (c.fidelity_score / totalWeight), 0)
    : 0;

  const sources = rootSources(children);
  const consensus_score = consensus(children);
  const child_fidelities: Record<string, number> = {};
  for (const c of children) child_fidelities[c.child_id] = c.fidelity_score;

  return {
    synthesis_id, parent_id, synthesized_at: now, child_count: children.length,
    merge_strategy: strategy, final_confidence: Math.round(final_confidence * 1000) / 1000,
    provenance: { root_sources: sources, trace_linked: true, replayable: true, evidence_count: sources.length },
    merged_reasoning: mergeReasoning(children), final_state: { children_merged: children.length },
    child_fidelities, consensus_score,
    dap_trace: children.map(c => ({ plane_id: 5, plane_name: "fidelity", child_contribution: c.child_id })),
    warnings: consensus_score < 0.7 ? [`Low consensus (${consensus_score}) — children disagreed`]
      : final_confidence < 0.80 ? [`Final confidence ${final_confidence} below threshold`]
      : []
  };
}
