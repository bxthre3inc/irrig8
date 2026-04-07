import React, { useState } from 'react';
import { Cpu, ToggleLeft, ToggleRight, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';

type Variable = { id: string; label: string; unit: string; min: number; max: number; step: number; default: number; description: string };

const VARIABLES: Variable[] = [
    { id: 'smp', label: 'Soil Matric Potential', unit: 'bars', min: -3.0, max: 0, step: 0.05, default: -0.5, description: 'Negative values; -0.33 = field capacity, -15 = permanent wilting point' },
    { id: 'swc', label: 'Volumetric Water Content', unit: '%', min: 5, max: 50, step: 0.5, default: 28, description: 'Measured SWC in the root Zone' },
    { id: 'ec', label: 'Electrical Conductivity', unit: 'dS/m', min: 0, max: 5, step: 0.1, default: 1.1, description: 'Soil salinity proxy; high EC reduces osmotic potential' },
    { id: 'vpd', label: 'Vapor Pressure Deficit', unit: 'kPa', min: 0, max: 5, step: 0.1, default: 1.8, description: 'Atmospheric demand for transpiration' },
    { id: 'solar', label: 'Solar Radiation', unit: 'W/m²', min: 0, max: 1200, step: 10, default: 620, description: 'Incoming shortwave solar radiation' },
    { id: 'ndvi', label: 'NDVI', unit: 'index', min: 0, max: 1, step: 0.01, default: 0.68, description: 'Normalized Difference Vegetation Index (0–1)' },
    { id: 'et', label: 'LSTM ET Forecast', unit: 'mm/day', min: 0, max: 15, step: 0.1, default: 6.4, description: 'Evapotranspiration forecast from LSTM model' },
];

function computeMAD(vals: Record<string, number>): { mad: number; pump: boolean; hoursToCritical: number; waterRate: number } {
    const mad = Math.max(0, Math.min(100, 100 * (vals.swc / 40) - (Math.abs(vals.smp) * 8) - (vals.vpd * 3) + (vals.ndvi * 15)));
    const pump = mad < 35 || vals.smp < -1.2;
    const hoursToCritical = pump ? 0 : Math.max(0, (mad - 20) / (vals.et / 24 * 4));
    const waterRate = pump ? vals.et * 0.85 : 0;
    return { mad: parseFloat(mad.toFixed(1)), pump, hoursToCritical: parseFloat(hoursToCritical.toFixed(1)), waterRate: parseFloat(waterRate.toFixed(2)) };
}

export const SPACModelSandbox: React.FC = () => {
    const defaultVals = Object.fromEntries(VARIABLES.map(v => [v.id, v.default]));
    const [vals, setVals] = useState<Record<string, number>>(defaultVals);
    const [calibMode, setCalibMode] = useState(false);
    const [sensitivityVar, setSensitivityVar] = useState('vpd');
    const [configName, setConfigName] = useState('');
    const [saved, setSaved] = useState(false);

    const { mad, pump, hoursToCritical, waterRate } = computeMAD(vals);

    const sensitivityPoints = Array.from({ length: 20 }, (_, i) => {
        const variable = VARIABLES.find(v => v.id === sensitivityVar)!;
        const testVal = variable.min + (i / 19) * (variable.max - variable.min);
        const testVals = { ...vals, [sensitivityVar]: testVal };
        const { mad: m } = computeMAD(testVals);
        return { x: parseFloat(testVal.toFixed(2)), mad: m };
    });

    const madColor = mad > 60 ? '#10b981' : mad > 40 ? '#fbbf24' : mad > 20 ? '#f97316' : '#ef4444';

    return (
        <div className="bg-[#070511] rounded-xl border border-purple-900/30 overflow-hidden flex flex-col min-h-[680px]">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-900/30 bg-black/30">
                <div className="bg-cyan-600/20 p-2 rounded-lg"><Cpu className="w-5 h-5 text-cyan-400" /></div>
                <div className="flex-1">
                    <h2 className="font-bold text-white text-sm tracking-wide">SPAC Continuum Model Sandbox</h2>
                    <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">Interactive Soil-Plant-Atmosphere Continuum validation</p>
                </div>
                <button onClick={() => setCalibMode(!calibMode)}
                    className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${calibMode ? 'bg-orange-600/20 border-orange-600/40 text-orange-400' : 'bg-black/40 border-purple-900/30 text-slate-400'}`}>
                    {calibMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    Calibration Mode
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT: Variable Panel */}
                    <div className="lg:col-span-1 space-y-3">
                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">7-Variable Input Panel</p>
                        {VARIABLES.map(v => (
                            <div key={v.id}>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-slate-300 font-medium">{v.label}</span>
                                    <span className="font-mono text-cyan-400">{vals[v.id]} <span className="text-slate-600">{v.unit}</span></span>
                                </div>
                                <input type="range" min={v.min} max={v.max} step={v.step} value={vals[v.id]}
                                    onChange={e => setVals(prev => ({ ...prev, [v.id]: Number(e.target.value) }))}
                                    className="w-full accent-cyan-500" />
                                <p className="text-[9px] text-slate-600 mt-0.5">{v.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Output + Sensitivity */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Decision Output */}
                        <div>
                            <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3">Live Decision Output</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="bg-black/40 border rounded-xl p-4 text-center col-span-2 sm:col-span-1 row-span-1" style={{ borderColor: madColor + '50' }}>
                                    <div className="relative w-16 h-16 mx-auto mb-2">
                                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                                            <circle cx="32" cy="32" r="24" fill="none" stroke="#1a1a2e" strokeWidth="8" />
                                            <circle cx="32" cy="32" r="24" fill="none" strokeWidth="8"
                                                stroke={madColor} strokeDasharray={`${(mad / 100) * 150.8} 150.8`} strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-lg font-black font-mono" style={{ color: madColor }}>{mad}%</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">MAD Battery</p>
                                </div>
                                <div className={`col-span-2 sm:col-span-1 rounded-xl p-4 text-center border ${pump ? 'bg-red-950/30 border-red-900/50' : 'bg-emerald-950/20 border-emerald-900/40'}`}>
                                    <p className="text-3xl font-black mt-2" style={{ color: pump ? '#f87171' : '#4ade80' }}>{pump ? 'PUMP' : 'HOLD'}</p>
                                    <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: pump ? '#f87171' : '#4ade80' }}>Irrigation</p>
                                </div>
                                <div className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black font-mono text-amber-400">{pump ? '—' : hoursToCritical}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{pump ? 'Irrigating' : 'Hrs to Critical'}</p>
                                </div>
                                <div className="bg-black/40 border border-blue-900/30 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black font-mono text-blue-400">{waterRate}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">mm/day Rate</p>
                                </div>
                            </div>
                        </div>

                        {/* Sensitivity */}
                        <div className="bg-black/40 border border-purple-900/30 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Threshold Sensitivity Map</p>
                                <select value={sensitivityVar} onChange={e => setSensitivityVar(e.target.value)} className="bg-black/40 border border-purple-900/40 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none">
                                    {VARIABLES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                                </select>
                            </div>
                            <div className="flex items-end gap-px h-24">
                                {sensitivityPoints.map((pt, i) => (
                                    <div key={i} title={`${VARIABLES.find(v => v.id === sensitivityVar)?.unit}: ${pt.x} → MAD: ${pt.mad}%`}
                                        className="flex-1 rounded-t-sm transition-all hover:opacity-80 cursor-crosshair"
                                        style={{ height: `${Math.max(4, pt.mad)}%`, backgroundColor: pt.mad > 60 ? '#10b981' : pt.mad > 40 ? '#fbbf24' : pt.mad > 20 ? '#f97316' : '#ef4444' }} />
                                ))}
                            </div>
                            <div className="flex justify-between text-[8px] text-slate-600 mt-1 font-mono">
                                <span>{sensitivityPoints[0]?.x} {VARIABLES.find(v => v.id === sensitivityVar)?.unit}</span>
                                <span className="text-purple-500">MAD % as {VARIABLES.find(v => v.id === sensitivityVar)?.label} varies</span>
                                <span>{sensitivityPoints[19]?.x} {VARIABLES.find(v => v.id === sensitivityVar)?.unit}</span>
                            </div>
                        </div>

                        {/* Calibration Mode */}
                        {calibMode && (
                            <div className="bg-orange-950/20 border border-orange-900/30 rounded-xl p-5 space-y-3">
                                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Calibration Mode</p>
                                <p className="text-xs text-slate-400">Comparing model predictions against actual measured outcomes from field data.</p>
                                <div className="grid grid-cols-3 gap-2 text-[10px]">
                                    {[{ label: 'Predicted SWC', value: '28.4%' }, { label: 'Actual SWC', value: '27.1%' }, { label: 'Residual', value: '+1.3%', color: 'text-amber-400' }].map(m => (
                                        <div key={m.label} className="bg-black/30 rounded-lg p-2 text-center">
                                            <p className={`font-black font-mono text-lg ${m.color || 'text-white'}`}>{m.value}</p>
                                            <p className="text-slate-600 mt-0.5">{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Export Config */}
                        <div className="bg-black/40 border border-purple-900/30 rounded-xl p-4">
                            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">Save Configuration</p>
                            <div className="flex gap-2">
                                <input value={configName} onChange={e => { setConfigName(e.target.value); setSaved(false); }}
                                    placeholder="e.g. SLV-Alfalfa-August …"
                                    className="flex-1 bg-black/40 border border-purple-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-purple-500/60" />
                                <button onClick={() => { if (configName) setSaved(true); }}
                                    className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                                    {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                                    {saved ? 'Saved!' : 'Save'}
                                </button>
                            </div>
                            {saved && <p className="text-[10px] text-emerald-500 mt-2">Configuration "{configName}" queued for CSE Worksheet candidate review.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SPACModelSandbox;
