import React, { useState } from 'react';
import { Trophy, AlertTriangle, CheckCircle2, DollarSign, FileText, Plus, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Milestone {
    id: string;
    title: string;
    dueDate: string;
    complete: boolean;
    reportRequired: boolean;
}

interface Award {
    id: string;
    funder: string;
    awardId: string;
    title: string;
    totalAmount: number;
    disbursed: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'closeout' | 'closed';
    milestones: Milestone[];
    contacts: { name: string; role: string; email: string }[];
}

function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }
function fmt$(n: number) { return n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`; }

function burnData(start: string, total: number, disbursed: number, end: string) {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const totalDays = Math.round((e - s) / 86400000);
    const periods = 12;
    return Array.from({ length: periods + 1 }, (_, i) => {
        const pct = i / periods;
        const elapsed = pct * totalDays;
        const label = new Date(s + elapsed * 86400000).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        const planned = total * pct;
        const actual = i <= 6 ? disbursed * (i / 6) : null;
        return { label, planned: Math.round(planned), actual: actual !== null ? Math.round(actual) : undefined };
    });
}

const SEED_AWARDS: Award[] = [
    {
        id: 'AWD-001',
        funder: 'LOR Foundation',
        awardId: 'LOR-TBD',
        title: 'Precision Groundwater Ledger — SLV Pilot',
        totalAmount: 0,
        disbursed: 0,
        startDate: '2026-03-01',
        endDate: '2027-03-01',
        status: 'active',
        milestones: [
            { id: 'MS-1', title: 'First Call — Introduction', dueDate: '2026-02-26', complete: false, reportRequired: false },
            { id: 'MS-2', title: 'Site Visit — SLV', dueDate: '2026-06-15', complete: false, reportRequired: false },
            { id: 'MS-3', title: '6-Month Progress Report', dueDate: '2026-09-01', complete: false, reportRequired: true },
        ],
        contacts: [{ name: 'Program Officer (TBD)', role: 'Water Program', email: '' }],
    },
];

function MilestoneRow({ ms, onToggle }: { ms: Milestone; onToggle: () => void }) {
    const d = daysUntil(ms.dueDate);
    const overdue = !ms.complete && d < 0;
    const urgent = !ms.complete && d >= 0 && d <= 14;
    return (
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${ms.complete ? 'bg-emerald-950/10 border-emerald-900/30' : overdue ? 'bg-red-950/15 border-red-900/30' : urgent ? 'bg-amber-950/10 border-amber-900/30' : 'bg-slate-900 border-slate-800'}`}>
            <button onClick={onToggle} className="shrink-0">
                {ms.complete ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className={`w-4 h-4 rounded-full border-2 ${overdue ? 'border-red-500' : urgent ? 'border-amber-400' : 'border-slate-600'}`} />}
            </button>
            <div className="flex-1">
                <p className={`text-xs font-medium ${ms.complete ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{ms.title}</p>
                <p className={`text-[10px] mt-0.5 ${ms.complete ? 'text-slate-600' : overdue ? 'text-red-400 font-bold' : urgent ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                    {ms.complete ? 'Completed' : overdue ? `Overdue by ${-d}d` : `Due in ${d}d · ${new Date(ms.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                </p>
            </div>
            {ms.reportRequired && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-900/30 border border-purple-800/40 text-purple-400 shrink-0">REPORT DUE</span>
            )}
        </div>
    );
}

const AwardTrackerComponent: React.FC = () => {
    const [awards, setAwards] = useState<Award[]>(SEED_AWARDS);
    const [activeAward, setActiveAward] = useState<Award>(SEED_AWARDS[0]);
    const [showNewMs, setShowNewMs] = useState(false);
    const [newMs, setNewMs] = useState({ title: '', dueDate: '', reportRequired: false });

    const toggleMilestone = (awardId: string, msId: string) => {
        setAwards(prev => prev.map(a => {
            if (a.id !== awardId) return a;
            const updated = { ...a, milestones: a.milestones.map(m => m.id === msId ? { ...m, complete: !m.complete } : m) };
            if (a.id === activeAward.id) setActiveAward(updated);
            return updated;
        }));
    };

    const addMilestone = () => {
        const ms: Milestone = { id: `MS-${Date.now()}`, title: newMs.title, dueDate: newMs.dueDate, complete: false, reportRequired: newMs.reportRequired };
        setAwards(prev => prev.map(a => {
            if (a.id !== activeAward.id) return a;
            const updated = { ...a, milestones: [...a.milestones, ms] };
            setActiveAward(updated);
            return updated;
        }));
        setShowNewMs(false);
        setNewMs({ title: '', dueDate: '', reportRequired: false });
    };

    const [loading, setLoading] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        try {
            const reportData = {
                awardId: activeAward.id,
                funder: activeAward.funder,
                generatedAt: new Date().toISOString(),
                metrics: {
                    disbursed: activeAward.disbursed,
                    milestonesCompleted: completedMs,
                    totalMilestones: activeAward.milestones.length
                }
            };
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Report_Stub_${activeAward.funder}_${activeAward.awardId}.json`;
            a.click();
        } catch (err) {
            console.error('Failed to generate report stub:', err);
        } finally {
            setLoading(false);
        }
    };

    const burn = burnData(activeAward.startDate, activeAward.totalAmount || 2400000, activeAward.disbursed || 0, activeAward.endDate);

    const completedMs = activeAward.milestones.filter(m => m.complete).length;
    const overdueMs = activeAward.milestones.filter(m => !m.complete && daysUntil(m.dueDate) < 0).length;

    return (
        <div className="space-y-5">
            {/* Award Selector */}
            <div className="flex flex-wrap gap-2">
                {awards.map(a => (
                    <button key={a.id} onClick={() => setActiveAward(a)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${a.id === activeAward.id ? 'bg-indigo-600/20 border-indigo-600/50 text-indigo-200' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                        <Trophy className="w-3.5 h-3.5" />{a.funder}
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${a.status === 'active' ? 'bg-emerald-900/30 text-emerald-400' : a.status === 'closeout' ? 'bg-amber-900/30 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>{a.status.toUpperCase()}</span>
                    </button>
                ))}
            </div>

            {/* Award KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Total Award', value: activeAward.totalAmount > 0 ? fmt$(activeAward.totalAmount) : 'Pending', icon: DollarSign, color: 'text-emerald-400' },
                    { label: 'Disbursed', value: activeAward.disbursed > 0 ? fmt$(activeAward.disbursed) : '—', icon: DollarSign, color: 'text-blue-400' },
                    { label: 'Milestones', value: `${completedMs}/${activeAward.milestones.length}`, icon: CheckCircle2, color: completedMs === activeAward.milestones.length ? 'text-emerald-400' : 'text-white' },
                    { label: 'Overdue', value: String(overdueMs), icon: AlertTriangle, color: overdueMs > 0 ? 'text-red-400' : 'text-slate-500' },
                ].map(m => (
                    <div key={m.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <m.icon className={`w-4 h-4 mb-2 ${m.color}`} />
                        <p className={`text-xl font-black font-mono ${m.color}`}>{m.value}</p>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">{m.label}</p>
                    </div>
                ))}
            </div>

            {/* Budget Burn Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Budget Burn — Planned vs. Actual</p>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={burn}>
                            <defs>
                                <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="label" stroke="#475569" tick={{ fill: '#475569', fontSize: 9 }} interval={2} />
                            <YAxis stroke="#475569" tick={{ fill: '#475569', fontSize: 9 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: 11 }} formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}`, '']} />
                            <Area type="monotone" dataKey="planned" stroke="#6366f1" fill="url(#plannedGrad)" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Planned" />
                            <Area type="monotone" dataKey="actual" stroke="#10b981" fill="url(#actualGrad)" strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Milestones */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Milestones & Reporting Schedule</p>
                    <button onClick={() => setShowNewMs(true)} className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                        <Plus className="w-3 h-3" /> Add
                    </button>
                </div>
                {showNewMs && (
                    <div className="bg-slate-950 border border-indigo-800/30 rounded-lg p-3 mb-3 space-y-2">
                        <input placeholder="Milestone title" value={newMs.title} onChange={e => setNewMs(f => ({ ...f, title: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-600" />
                        <div className="flex gap-2">
                            <input type="date" value={newMs.dueDate} onChange={e => setNewMs(f => ({ ...f, dueDate: e.target.value }))}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none" />
                            <label className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                <input type="checkbox" checked={newMs.reportRequired} onChange={e => setNewMs(f => ({ ...f, reportRequired: e.target.checked }))} className="accent-purple-500" />
                                Report Due
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={addMilestone} className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded transition-colors">Add</button>
                            <button onClick={() => setShowNewMs(false)} className="text-slate-500 text-[10px] px-3 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-colors">Cancel</button>
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    {activeAward.milestones
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .map(ms => (
                            <MilestoneRow key={ms.id} ms={ms} onToggle={() => toggleMilestone(activeAward.id, ms.id)} />
                        ))
                    }
                </div>
            </div>

            {/* Report Stub Generator */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Report Stub Generator</p>
                <p className="text-xs text-slate-500 mb-3">Auto-fills a progress report template with current platform metrics for funder submission.</p>
                <button
                    onClick={generateReport}
                    disabled={loading}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" /> : <FileText className="w-4 h-4 text-indigo-400" />}
                    {loading ? 'Generating...' : `Generate Report Stub — ${activeAward.funder}`}
                </button>
            </div>
        </div>
    );
};

export default function AwardTracker() {
    return <AwardTrackerComponent />;
}
