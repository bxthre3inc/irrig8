import React from 'react';
import { Calendar } from 'lucide-react';
import { Layer } from '../types';
import { ALL_LAYERS } from '../constants';

interface LayersTabProps {
    enabledLayers: Set<string>;
    toggleLayer: (id: string) => void;
    dateA: string;
    setDateA: (date: string) => void;
    dateB: string;
    setDateB: (date: string) => void;
    blend: number;
    setBlend: (blend: number) => void;
    activeLayers: Layer[];
    attentionMode: 'DORMANT' | 'ANTICIPATORY' | 'RIPPLE' | 'COLLAPSE';
    predictiveMode: boolean;
    showVriOverlay: boolean;
}

export const LayersTab: React.FC<LayersTabProps> = ({
    enabledLayers,
    toggleLayer,
    dateA,
    setDateA,
    dateB,
    setDateB,
    blend,
    setBlend,
    activeLayers,
    attentionMode,
    predictiveMode,
    showVriOverlay
}) => {
    return (
        <div className="space-y-5">
            <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Available Layers</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_LAYERS.map(l => (
                        <button key={l.id} onClick={() => toggleLayer(l.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-xs text-left transition-all ${enabledLayers.has(l.id) ? 'border-opacity-60 bg-opacity-20' : 'bg-black/30 border-purple-900/30 text-slate-400 hover:border-purple-700/40'}`}
                            style={enabledLayers.has(l.id) ? { borderColor: l.color + '90', backgroundColor: l.color + '18', color: '#e2e8f0' } : {}}>
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: enabledLayers.has(l.id) ? l.color : '#374151' }} />
                            <div>
                                <span className="font-semibold block">{l.label}</span>
                                <span className="text-[10px] opacity-60">{l.source}</span>
                            </div>
                            {enabledLayers.has(l.id) && <span className="ml-auto font-mono text-[10px]" style={{ color: l.color }}>{l.value} {l.unit}</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-black/40 rounded-xl border border-blue-900/30 p-5">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Date-Range Comparison</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Date A</label>
                        <input type="date" value={dateA} onChange={e => setDateA(e.target.value)} className="w-full mt-1 bg-black/40 border border-blue-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/60" />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Date B</label>
                        <input type="date" value={dateB} onChange={e => setDateB(e.target.value)} className="w-full mt-1 bg-black/40 border border-blue-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/60" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>← Date A ({dateA})</span><span>Date B ({dateB}) →</span></div>
                    <input type="range" min={0} max={100} value={blend} onChange={e => setBlend(Number(e.target.value))} className="w-full accent-blue-500" />
                    <div className="mt-3 h-32 rounded-lg border border-blue-900/30 flex overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-900/60 to-sky-900/60 flex items-center justify-center text-[10px] text-slate-400 transition-all" style={{ width: `${blend}%` }}>A: {dateA}</div>
                        <div className="bg-gradient-to-r from-sky-900/60 to-amber-900/60 flex items-center justify-center text-[10px] text-slate-400 transition-all" style={{ width: `${100 - blend}%` }}>B: {dateB}</div>
                    </div>
                    {/* Dynamic Engine Feedback Bar */}
                    <div className="mt-2 h-1 bg-black/40 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${attentionMode === 'COLLAPSE' ? 'w-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                            attentionMode === 'ANTICIPATORY' ? 'w-2/3 bg-amber-500' :
                                'w-1/3 bg-emerald-500/50'
                            }`} />
                    </div>
                    <div className="mt-1 flex justify-between text-[8px] font-mono text-slate-600 uppercase">
                        <span>Engine Load: {attentionMode === 'COLLAPSE' ? 'High/Real-time' : attentionMode === 'ANTICIPATORY' ? 'Adaptive' : 'Standard'}</span>
                        <span>Confidence: {attentionMode === 'COLLAPSE' ? (predictiveMode ? '92%' : '98%') : '85%'}</span>
                    </div>

                    {predictiveMode && (
                        <div className="mt-3 p-2 rounded bg-purple-500/10 border border-purple-500/30">
                            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest flex justify-between">
                                <span>Predictive Synthesis Active</span>
                                <span>+48h Forecast</span>
                            </p>
                            <p className="text-[9px] text-slate-500 mt-1 italic">Drying trend detected in sector B; VRI recommendation triggered.</p>
                        </div>
                    )}

                    {showVriOverlay && (
                        <div className="mt-3 p-2 rounded bg-emerald-500/10 border border-emerald-500/30">
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex justify-between">
                                <span>VRI Prescription Efficiency</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                    <span className="text-[8px] text-blue-400/80 border border-blue-400/30 px-1 rounded">ENCLAVE: FHE-BATCHED</span>
                                    <span>Optimal</span>
                                </div>
                            </p>
                            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                                <div className="bg-black/20 p-1 rounded">
                                    <div className="text-[10px] text-emerald-300 font-mono">14.2%</div>
                                    <div className="text-[7px] text-slate-500 uppercase">H2O Savings</div>
                                </div>
                                <div className="bg-black/20 p-1 rounded">
                                    <div className="text-[10px] text-emerald-300 font-mono">0.94</div>
                                    <div className="text-[7px] text-slate-500 uppercase">Uniformity</div>
                                </div>
                                <div className="bg-black/20 p-1 rounded">
                                    <div className="text-[10px] text-emerald-300 font-mono">120%</div>
                                    <div className="text-[7px] text-slate-500 uppercase">Target Flow</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {activeLayers.length > 0 && (
                <div className="bg-black/40 rounded-xl border border-purple-900/30 p-4">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">Active Layer Pixel Values (Simulated)</p>
                    <div className="space-y-1.5">
                        {activeLayers.map(l => (
                            <div key={l.id} className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: l.color }} />{l.label}</span>
                                <span className="font-mono" style={{ color: l.color }}>{l.value} <span className="text-slate-600">{l.unit}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
