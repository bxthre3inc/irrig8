import { useState } from "react";

interface QueueItem {
  id: string;
  agent_id: string;
  agent_name: string;
  tool_name: string;
  params: Record<string, any>;
  rationale: string;
  risk: string;
  alternatives: string;
  created_at: string;
  priority: "P0" | "P1" | "P2";
}

const MOCK_QUEUE: QueueItem[] = [
  {
    id: "cq-001",
    agent_id: "maya",
    agent_name: "Maya Patel",
    tool_name: "approve_grant_submission",
    params: { grant_id: "ARPA-E-OPEN-2026", deadline: "2026-05-01", amount: "$1.5M" },
    rationale: "ARPA-E OPEN 2026 deadline is 13 days away. Submitting 15 days early avoids disqualification.",
    risk: "Submission is irreversible. Wrong form or incomplete data voids the application.",
    alternatives: "Requested 2-week extension — ARPA-E does not allow extensions. Auto-rejection if not filed.",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    priority: "P0",
  },
  {
    id: "cq-002",
    agent_id: "iris",
    agent_name: "Iris Park",
    tool_name: "deploy_firmware",
    params: { device_group: "irrig8-sensors-slv", version: "2.1.4", changelog: "soil-moisture calibration fix" },
    rationale: "Soil moisture readings are off by ±8% across all SLV sensors. Firmware v2.1.4 corrects the calibration matrix.",
    risk: "Firmware push to 48 devices in field — if bricked, requires physical on-site recovery. Estimated downtime: 4-6 hours.",
    alternatives: "Manual calibration visit — $8,200 truck roll + 3-day delay. Push to v2.1.4 — no cost, immediate fix.",
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    priority: "P1",
  },
  {
    id: "cq-003",
    agent_id: "raj",
    agent_name: "Raj (Legal)",
    tool_name: "file_patent",
    params: { patent_id: "PROV-007", title: "Self-Modification Engine — Darwin Gödel Cycle", deadline: "2026-05-15" },
    rationale: "7 provisional patents need filing by May 15. PROV-007 covers Agentic's SME. Without it, SME IP is prior-art vulnerable.",
    risk: "Filing establishes priority date. Miss it = IP goes to public domain.",
    alternatives: "Trade secret protection instead — less defensible in court, no priority date.",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    priority: "P1",
  },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ChairmanQueue() {
  const [queue, setQueue] = useState<QueueItem[]>(MOCK_QUEUE);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "denied">("pending");

  const pending = queue.filter((q) => !q.approved && !q.denied);
  const approved = queue.filter((q) => q.approved);
  const denied = queue.filter((q) => q.denied);

  const handleApprove = (id: string) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, approved: true, approved_at: new Date().toISOString(), status: "approved" }
          : q
      )
    );
  };

  const handleDeny = (id: string) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, denied: true, denied_at: new Date().toISOString(), status: "denied" }
          : q
      )
    );
  };

  const displayed =
    activeTab === "pending"
      ? pending
      : activeTab === "approved"
      ? approved
      : denied;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-400">Chairman Queue</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Human-in-the-loop approvals — no action executes without your sign-off
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-amber-400">{pending.length}</span>
          <span className="text-zinc-400 text-sm">pending</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg w-fit">
        {[
          { key: "pending", label: "Pending", count: pending.length },
          { key: "approved", label: "Approved", count: approved.length },
          { key: "denied", label: "Denied", count: denied.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-amber-500 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Queue items */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <div className="text-6xl mb-4">✓</div>
          <p>No {activeTab} items</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((item) => (
            <div
              key={item.id}
              className={`border rounded-xl p-5 ${
                item.priority === "P0"
                  ? "border-red-500/50 bg-red-950/20"
                  : item.priority === "P1"
                  ? "border-amber-500/50 bg-amber-950/20"
                  : "border-zinc-700 bg-zinc-900"
              }`}
            >
              {/* Item header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      item.priority === "P0"
                        ? "bg-red-600 text-white"
                        : item.priority === "P1"
                        ? "bg-amber-600 text-black"
                        : "bg-zinc-600 text-white"
                    }`}
                  >
                    {item.agent_id.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{item.agent_name}</div>
                    <div className="text-xs text-zinc-400">
                      requested {timeAgo(item.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded font-mono ${
                      item.priority === "P0"
                        ? "bg-red-900 text-red-300"
                        : item.priority === "P1"
                        ? "bg-amber-900 text-amber-300"
                        : "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                    {item.tool_name}
                  </span>
                </div>
              </div>

              {/* Parameters */}
              <div className="mb-4 bg-black/40 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-1 font-mono">Parameters</div>
                <pre className="text-xs text-zinc-300 font-mono overflow-x-auto">
                  {JSON.stringify(item.params, null, 2)}
                </pre>
              </div>

              {/* Rationale / Risk / Alternatives */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-green-950/30 border border-green-800/30 rounded-lg p-3">
                  <div className="text-xs text-green-400 font-semibold mb-1">✓ Rationale</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.rationale}</p>
                </div>
                <div className="bg-red-950/30 border border-red-800/30 rounded-lg p-3">
                  <div className="text-xs text-red-400 font-semibold mb-1">⚠ Risk</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.risk}</p>
                </div>
                <div className="bg-blue-950/30 border border-blue-800/30 rounded-lg p-3">
                  <div className="text-xs text-blue-400 font-semibold mb-1">⊘ Alternatives</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.alternatives}</p>
                </div>
              </div>

              {/* Actions */}
              {activeTab === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleDeny(item.id)}
                    className="flex-1 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    ✗ Deny
                  </button>
                  <button className="px-4 py-2.5 border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-lg transition-colors text-sm">
                    ? Request Clarification
                  </button>
                </div>
              )}

              {item.approved && (
                <div className="text-center py-2 bg-emerald-950/50 text-emerald-400 text-sm rounded-lg font-semibold">
                  ✓ Approved — executed at {new Date((item as any).approved_at).toLocaleString()}
                </div>
              )}

              {item.denied && (
                <div className="text-center py-2 bg-zinc-800 text-zinc-400 text-sm rounded-lg">
                  ✗ Denied
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}