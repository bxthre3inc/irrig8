import React, { useState } from 'react';
import { GitBranch, BarChart2, Sigma, TrendingUp, Download, Hash } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

type Tab = 'inputs' | 'trend' | 'variogram' | 'residual' | 'grid';

const MOCK_INPUTS = [
    { name: 'SMP @ 12"', value: -0.82, unit: 'bars', source: 'VFA-001', hash: '3a9f…c421' },
    { name: 'SMP @ 24"', value: -1.14, unit: 'bars', source: 'VFA-001', hash: '8e1d…bb92' },
    { name: 'SMP @ 36"', value: -1.98, unit: 'bars', source: 'VFA-001', hash: 'f22a…0013' },
    { name: 'SWC @ 12"', value: 28.4, unit: '%', source: 'LRZ-042', hash: '9c3b…a782' },
    { name: 'EC', value: 1.14, unit: 'dS/m', source: 'LRZ-042', hash: '1b8f…cd43' },
    { name: 'VPD', value: 1.82, unit: 'kPa', source: 'WSN-007', hash: '6d4a…f901' },
    { name: 'Solar Rad.', value: 612, unit: 'W/m²', source: 'HUD-003', hash: 'a71e…2c55' },
    { name: 'NDVI', value: 0.68, unit: 'index', source: 'S2/Drone', hash: '5f9c…8801' },
    { name: 'NDWI', value: 0.21, unit: 'index', source: 'S2', hash: 'b34e…41af' },
    { name: 'LST', value: 34.1, unit: '°C', source: 'L8', hash: '2a6d…9931' },
    { name: 'Elevation', value: 2341, unit: 'm', source: 'DEM', hash: '0f1c…7e44' },
    { name: 'Slope', value: 2.1, unit: '°', source: 'DEM', hash: '4b82…dc10' },
];

const TREND_COEFFS = [
    { covariate: 'NDVI', coeff: 0.412, se: 0.038, t: 10.84, p: '< 0.001' },
    { covariate: 'NDWI', coeff: 0.187, se: 0.029, t: 6.45, p: '< 0.001' },
    { covariate: 'LST', coeff: -0.023, se: 0.005, t: -4.61, p: '< 0.001' },
    { covariate: 'Elevation', coeff: 0.0001, se: 0.00003, t: 3.33, p: '0.002' },
    { covariate: 'Slope', coeff: -0.004, se: 0.002, t: -2.11, p: '0.041' },
];

function mockVariogram() {
    return Array.from({ length: 20 }, (_, i) => {
        const h = (i + 1) * 50;
        const sill = 0.048, range = 650, nugget = 0.003;
        const theoretical = nugget + (sill - nugget) * (1.5 * (h / range) - 0.5 * Math.pow(h / range, 3));
        const empirical = Math.max(0, theoretical + (Math.random() - 0.5) * 0.006);
        return { h, theoretical: parseFloat(theoretical.toFixed(5)), empirical: parseFloat(empirical.toFixed(5)) };
    });
}

function mock1mGrid() {
    return Array.from({ length: 12 }, (_, row) =>
        Array.from({ length: 12 }, (_, col) => {
            const v = 0.25 + Math.sin(row / 3) * 0.15 + Math.cos(col / 4) * 0.1 + Math.random() * 0.05;
            return parseFloat(v.toFixed(3));
        })
    );
}

function moistureColor(v: number): string {
    if (v > 0.45) return '#10b981';
    if (v > 0.35) return '#34d399';
    if (v > 0.28) return '#fbbf24';
    if (v > 0.20) return '#f97316';
    return '#ef4444';
}

export const CSEKrigingWorksheetInspector: React.FC = () => {
    const [tab, setTab] = useState<Tab>('inputs');
    const [fieldId] = useState('FIELD-SLV-001');
    const [timestamp] = useState('2025-09-15T14:30:00Z');
    const variogramData = mockVariogram();
    const grid = mock1mGrid();

    return (
        <div className="bg-[#070511] rounded-xl border border-purple-900/30 overflow-hidden flex flex-col min-h-[680px]">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-900/30 bg-black/30">
                <div className="bg-emerald-600/20 p-2 rounded-lg"><GitBranch className="w-5 h-5 text-emerald-400" /></div>
                <div className="flex-1">
                    <h2 className="font-bold text-white text-sm tracking-wide">CSE Kriging Worksheet Inspector</h2>
                    <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest">Full transparency into every kriging computation</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-mono text-slate-500">Field: <span className="text-emerald-400">{fieldId}</span></p>
                    <p className="text-[10px] font-mono text-slate-600">{timestamp}</p>
                </div>
            </div>

            <div className="flex border-b border-purple-900/20 bg-black/20 px-6 overflow-x-auto">
                {([
                    ['inputs', 'Inputs', Hash],
                    ['trend', 'Trend Model', TrendingUp],
                    ['variogram', 'Variogram', BarChart2],
                    ['residual', 'Residuals', Sigma],
                    ['grid', 'Final Grid', GitBranch]
                ] as [Tab, string, any][]).map(([id, label, Icon]) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`py-3 px-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${tab === id ? 'border-emerald-500 text-emerald-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                        <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {/* INPUTS */}
                {tab === 'inputs' && (
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Input Variables with Hardware Provenance</p>
                        <div className="space-y-1.5">
                            {MOCK_INPUTS.map(inp => (
                                <div key={inp.name} className="flex items-center gap-3 px-3 py-2.5 bg-black/40 rounded-lg border border-purple-900/20 hover:border-emerald-900/40 transition-colors group">
                                    <span className="text-xs text-slate-300 w-28 font-medium">{inp.name}</span>
                                    <span className="text-sm font-black font-mono text-emerald-400">{inp.value}</span>
                                    <span className="text-[10px] text-slate-600">{inp.unit}</span>
                                    <span className="ml-auto text-[10px] font-mono text-slate-600">src: <span className="text-slate-400">{inp.source}</span></span>
                                    <span className="text-[10px] font-mono text-purple-800 group-hover:text-purple-600 transition-colors">#{inp.hash}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TREND MODEL */}
                {tab === 'trend' && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-3 gap-3">
                            {[{ label: 'Model R²', value: '0.847' }, { label: 'Adj. R²', value: '0.831' }, { label: 'F-stat p', value: '< 0.001' }].map(m => (
                                <div key={m.label} className="bg-black/40 border border-emerald-900/30 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-black font-mono text-emerald-400">{m.value}</p>
                                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mt-1">{m.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-purple-900/30">
                                        <th className="text-left py-2 text-purple-400 font-bold uppercase tracking-widest">Covariate</th>
                                        <th className="text-right py-2 text-purple-400 font-bold uppercase tracking-widest">Coeff</th>
                                        <th className="text-right py-2 text-purple-400 font-bold uppercase tracking-widest">Std Err</th>
                                        <th className="text-right py-2 text-purple-400 font-bold uppercase tracking-widest">t-stat</th>
                                        <th className="text-right py-2 text-purple-400 font-bold uppercase tracking-widest">p-value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {TREND_COEFFS.map(c => (
                                        <tr key={c.covariate} className="border-b border-purple-900/10 hover:bg-purple-900/10">
                                            <td className="py-2.5 text-slate-300 font-medium">{c.covariate}</td>
                                            <td className="py-2.5 text-right font-mono text-emerald-400">{c.coeff}</td>
                                            <td className="py-2.5 text-right font-mono text-slate-500">{c.se}</td>
                                            <td className="py-2.5 text-right font-mono text-blue-400">{c.t}</td>
                                            <td className="py-2.5 text-right font-mono text-amber-400">{c.p}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* VARIOGRAM */}
                {tab === 'variogram' && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-3 gap-3">
                            {[{ label: 'Nugget', value: '0.003' }, { label: 'Sill', value: '0.048' }, { label: 'Range', value: '650m' }].map(m => (
                                <div key={m.label} className="bg-black/40 border border-blue-900/30 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-black font-mono text-blue-400">{m.value}</p>
                                    <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mt-1">{m.label}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-500">Spherical variogram model fit to method-of-moments empirical estimates</p>
                        <div className="bg-black/40 border border-purple-900/30 rounded-xl p-4 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={variogramData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e0a3e" vertical={false} />
                                    <XAxis dataKey="h" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} label={{ value: 'Lag Distance (m)', position: 'insideBottom', fill: '#6b7280', fontSize: 10, dy: 10 }} />
                                    <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#070511', borderColor: '#3b0764', borderRadius: '8px', color: '#e9d5ff', fontSize: 11 }} />
                                    <Line type="monotone" dataKey="empirical" stroke="#60a5fa" strokeWidth={0} dot={{ fill: '#60a5fa', r: 3 }} name="Empirical" />
                                    <Line type="monotone" dataKey="theoretical" stroke="#a855f7" strokeWidth={2} dot={false} name="Spherical Model" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-4 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />Empirical MOM estimates</span>
                            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-purple-500 inline-block" />Fitted spherical model</span>
                        </div>
                    </div>
                )}

                {/* RESIDUALS */}
                {tab === 'residual' && (
                    <div className="space-y-5">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Kriging Variance Map (High = Low Confidence)</p>
                        <div className="grid grid-cols-12 gap-0.5">
                            {grid.map((row, i) =>
                                row.map((v, j) => {
                                    const variance = Math.abs(v - 0.35) * 0.8;
                                    const opacity = 0.2 + variance * 1.5;
                                    return (
                                        <div key={`${i}-${j}`} title={`Var: ${variance.toFixed(3)}`}
                                            className="aspect-square rounded-sm transition-all hover:opacity-80 cursor-crosshair"
                                            style={{ backgroundColor: variance > 0.08 ? `rgba(239,68,68,${Math.min(opacity, 0.9)})` : `rgba(16,185,129,${Math.min(opacity * 0.7, 0.6)})` }} />
                                    );
                                })
                            )}
                        </div>
                        <div className="flex gap-4 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/50 inline-block" />Low Variance (confident)</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/70 inline-block" />High Variance (sparse coverage)</span>
                        </div>
                    </div>
                )}

                {/* FINAL GRID */}
                {tab === 'grid' && (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">1m Resolution Prediction Grid (12×12 sample)</p>
                            <button className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 border border-purple-900/40 rounded px-3 py-1.5 hover:border-purple-500/60 transition-colors">
                                <Download className="w-3 h-3" /> Export GeoTIFF
                            </button>
                        </div>
                        <div className="grid grid-cols-12 gap-0.5">
                            {grid.map((row, i) =>
                                row.map((v, j) => (
                                    <div key={`${i}-${j}`} title={`SWC: ${v}`}
                                        className="aspect-square rounded-sm flex items-center justify-center cursor-crosshair transition-all hover:scale-110"
                                        style={{ backgroundColor: moistureColor(v) + 'cc' }}>
                                        <span className="text-[7px] font-mono text-white/70 leading-none">{v}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex gap-4 text-[10px] text-slate-500 flex-wrap">
                            {[['> 0.45', '#10b981', 'Optimal'], ['0.35–0.45', '#34d399', 'Good'], ['0.28–0.35', '#fbbf24', 'Monitor'], ['0.20–0.28', '#f97316', 'Stressed'], ['< 0.20', '#ef4444', 'Critical']].map(([range, color, label]) => (
                                <span key={label} className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: color + '99' }} />{label} ({range})</span>
                            ))}
                        </div>
                        <div className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-[10px] font-mono text-slate-500 space-y-1">
                            <p>Model version: <span className="text-purple-400">cse-rk-v2.4.1</span></p>
                            <p>Input timestamp: <span className="text-slate-300">{timestamp}</span></p>
                            <p>Hash chain proof: <span className="text-emerald-400">sha256:8f3a…d901</span></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CSEKrigingWorksheetInspector;
