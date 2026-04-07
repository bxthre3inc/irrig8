import React, { useState, useRef } from 'react';
import { TestTube2, Map, Zap, BarChart2, Image, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

type TrialStatus = 'design' | 'running' | 'complete';
type Tab = 'Zones' | 'power' | 'live' | 'stats' | 'viz';
const TREATMENTS = ['Irrigation Protocol A (MAD-50%)', 'Irrigation Protocol B (MAD-65%)', 'Fertilizer Variant X', 'Cover Crop: Rye', 'Control (Standard)'];

function mockTrialData(days: number) {
    return Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        treatmentNDVI: parseFloat((0.68 + Math.sin(i / 20) * 0.06 + Math.random() * 0.01).toFixed(3)),
        controlNDVI: parseFloat((0.62 + Math.sin(i / 20) * 0.04 + Math.random() * 0.01).toFixed(3)),
    }));
}

function BoxPlot({ item, max }: { item: { Zone: string; q1: number; median: number; q3: number; min: number; max: number; color: string }; max: number }) {
    const scale = (v: number) => `${((v - 0.5) / (max - 0.5)) * 100}%`;
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-20 text-right">{item.Zone}</span>
            <div className="flex-1 h-8 relative">
                <div className="absolute inset-y-0 flex items-center" style={{ left: scale(item.min), right: `calc(100% - ${scale(item.max)})` }}>
                    <div className="w-full h-0.5 opacity-40" style={{ backgroundColor: item.color }} />
                </div>
                <div className="absolute inset-y-1 rounded" style={{ left: scale(item.q1), right: `calc(100% - ${scale(item.q3)})`, backgroundColor: item.color + '40', border: `1px solid ${item.color}` }} />
                <div className="absolute inset-y-0.5 w-0.5 rounded" style={{ left: scale(item.median), backgroundColor: item.color }} />
            </div>
            <span className="text-xs font-mono w-10" style={{ color: item.color }}>{item.median}</span>
        </div>
    );
}

const BOX_DATA = [
    { Zone: 'Control', q1: 0.61, median: 0.63, q3: 0.66, min: 0.58, max: 0.68, color: '#6b7280' },
    { Zone: 'Treatment', q1: 0.66, median: 0.70, q3: 0.73, min: 0.63, max: 0.77, color: '#10b981' },
];

export const FieldTrialDesignEngine: React.FC = () => {
    const [tab, setTab] = useState<Tab>('Zones');
    const [trialStatus, setTrialStatus] = useState<TrialStatus>('design');
    const [treatmentA, setTreatmentA] = useState(TREATMENTS[0]);
    const [effectSize, setEffectSize] = useState(0.3);
    const [alpha, setAlpha] = useState(0.05);
    const trialData = useRef(mockTrialData(30));
    const elapsed = 18;

    const requiredNodes = Math.ceil(2 * (1.96 + 0.842) ** 2 / (effectSize ** 2));
    const isPowered = requiredNodes <= 6;

    return (
        <div className="bg-[#070511] rounded-xl border border-purple-900/30 overflow-hidden flex flex-col min-h-[680px]">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-900/30 bg-black/30">
                <div className="bg-amber-600/20 p-2 rounded-lg"><TestTube2 className="w-5 h-5 text-amber-400" /></div>
                <div className="flex-1">
                    <h2 className="font-bold text-white text-sm tracking-wide">Field Trial Design Engine</h2>
                    <p className="text-[10px] text-amber-500 font-mono uppercase tracking-widest">Spatial A/B agronomic experiments</p>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${trialStatus === 'design' ? 'border-slate-700 text-slate-400' : trialStatus === 'running' ? 'border-amber-600/40 bg-amber-600/10 text-amber-400' : 'border-emerald-600/40 bg-emerald-600/10 text-emerald-400'}`}>
                    {trialStatus === 'design' ? 'Design Phase' : trialStatus === 'running' ? '● Running' : '✓ Complete'}
                </span>
            </div>

            <div className="flex border-b border-purple-900/20 bg-black/20 px-6 overflow-x-auto">
                {([['Zones', 'Zone Mapper', Map], ['power', 'Power Analysis', Zap], ['live', 'Live Dashboard', Clock], ['stats', 'Statistics', BarChart2], ['viz', 'Visualization', Image]] as [Tab, string, any][]).map(([id, label, Icon]) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`py-3 px-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${tab === id ? 'border-amber-500 text-amber-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                        <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {tab === 'Zones' && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-2">Treatment Protocol</label>
                            <select value={treatmentA} onChange={e => setTreatmentA(e.target.value)}
                                className="w-full bg-black/40 border border-amber-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none">
                                {TREATMENTS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-8 gap-0.5 rounded-xl overflow-hidden border border-purple-900/20">
                            {Array.from({ length: 64 }, (_, i) => {
                                const col = i % 8;
                                const isTreatment = col < 4;
                                return <div key={i} className={`aspect-square flex items-center justify-center text-[7px] font-bold ${isTreatment ? 'bg-emerald-900/40 text-emerald-600' : 'bg-slate-900/60 text-slate-600'}`}>{isTreatment ? 'T' : 'C'}</div>;
                            })}
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-purple-900/20 border border-purple-900/30 rounded-lg text-xs text-purple-300">
                            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Zone configuration valid — ≥3 nodes per Zone.
                        </div>
                        <button onClick={() => { setTrialStatus('running'); setTab('live'); }}
                            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">
                            <Zap className="w-4 h-4" /> Begin Trial
                        </button>
                    </div>
                )}

                {tab === 'power' && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Effect Size (d): {effectSize.toFixed(2)}</label>
                                <input type="range" min={0.1} max={1.0} step={0.05} value={effectSize} onChange={e => setEffectSize(Number(e.target.value))} className="w-full mt-2 accent-amber-500" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">α Level</label>
                                <select value={alpha} onChange={e => setAlpha(Number(e.target.value))} className="w-full mt-2 bg-black/40 border border-amber-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none">
                                    {[0.01, 0.05, 0.10].map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className={`rounded-xl p-6 border text-center ${isPowered ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-red-950/20 border-red-900/40'}`}>
                            <p className="text-5xl font-black font-mono mb-2" style={{ color: isPowered ? '#4ade80' : '#f87171' }}>{requiredNodes}</p>
                            <p className={`text-sm font-bold ${isPowered ? 'text-emerald-400' : 'text-red-400'}`}>Required Nodes per Zone</p>
                            <p className="text-xs text-slate-500 mt-2">at d={effectSize}, α={alpha}, power=0.80</p>
                            {!isPowered && <div className="flex items-center gap-2 mt-4 p-3 bg-red-950/30 rounded-lg text-xs text-red-300 justify-center"><AlertTriangle className="w-4 h-4" />Underpowered — add sensors or reduce required power.</div>}
                        </div>
                    </div>
                )}

                {tab === 'live' && (
                    <div className="space-y-4">
                        {trialStatus === 'design' ? (
                            <div className="text-center py-16 text-slate-500"><Clock className="w-10 h-10 mx-auto mb-3 opacity-20" /><p className="text-sm">Trial not started yet.</p></div>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-3">
                                    {[{ label: 'Day', value: `${elapsed}/30` }, { label: 'Treat NDVI', value: '0.702', color: 'text-emerald-400' }, { label: 'Control NDVI', value: '0.634', color: 'text-slate-400' }].map(m => (
                                        <div key={m.label} className="bg-black/40 border border-purple-900/30 rounded-xl p-3 text-center">
                                            <p className={`text-2xl font-black font-mono ${(m as any).color ?? 'text-white'}`}>{m.value}</p>
                                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                                    {trialData.current.slice(0, elapsed).map(d => (
                                        <div key={d.day} className="flex items-center gap-2 text-[10px] font-mono">
                                            <span className="text-slate-600 w-8">d{d.day}</span>
                                            <div className="flex-1 h-1 bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.treatmentNDVI * 100}%` }} /></div>
                                            <span className="text-emerald-500 w-10 text-right">{d.treatmentNDVI}</span>
                                            <div className="flex-1 h-1 bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-slate-500 rounded-full" style={{ width: `${d.controlNDVI * 100}%` }} /></div>
                                            <span className="text-slate-500 w-10 text-right">{d.controlNDVI}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setTrialStatus('complete')} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                                    <CheckCircle2 className="w-4 h-4" /> Mark Complete
                                </button>
                            </>
                        )}
                    </div>
                )}

                {tab === 'stats' && (
                    <div className="space-y-5">
                        {trialStatus !== 'complete' ? (
                            <div className="text-center py-16 text-slate-500"><BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-20" /><p className="text-sm">Complete the trial first.</p></div>
                        ) : (
                            <>
                                <div className="bg-black/40 border border-purple-900/30 rounded-xl p-5 space-y-2">
                                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">Mann-Whitney U Results</p>
                                    {[{ label: 'U statistic', value: '312' }, { label: 'p-value', value: '0.0031' }, { label: "Cohen's d", value: '0.84' }, { label: '95% CI', value: '[0.041, 0.118]' }].map(r => (
                                        <div key={r.label} className="flex justify-between text-xs px-2 py-1.5 bg-black/30 rounded">
                                            <span className="text-slate-400">{r.label}</span>
                                            <span className="font-mono text-emerald-400 font-bold">{r.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 text-sm text-slate-300">
                                    <span className="font-bold text-emerald-400">Significant</span> at α=0.05 — Treatment NDVI significantly higher (p=0.0031, d=0.84).
                                </div>
                            </>
                        )}
                    </div>
                )}

                {tab === 'viz' && (
                    <div className="space-y-5">
                        {trialStatus !== 'complete' ? (
                            <div className="text-center py-16 text-slate-500"><Image className="w-10 h-10 mx-auto mb-3 opacity-20" /><p className="text-sm">Complete the trial first.</p></div>
                        ) : (
                            <>
                                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">NDVI Distribution by Zone</p>
                                <div className="space-y-4">
                                    {BOX_DATA.map(item => <BoxPlot key={item.Zone} item={item} max={0.85} />)}
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    {[{ label: 'Treatment', opacity: 8, color: 'rgba(16,185,129,' }, { label: 'Control', opacity: 4, color: 'rgba(107,114,128,' }].map(z => (
                                        <div key={z.label} className="bg-slate-900/40 border border-slate-700/30 rounded-lg p-4 text-center">
                                            <p className="text-xs text-slate-400 mb-2">{z.label} Zone</p>
                                            <div className="grid grid-cols-4 gap-0.5">
                                                {Array.from({ length: 16 }, (_, i) => (
                                                    <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: `${z.color}${(0.2 + Math.random() * 0.5).toFixed(2)})` }} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FieldTrialDesignEngine;
