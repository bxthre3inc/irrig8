import React from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { WizardStep, Tab } from '../types';
import { INSTRUMENT_TYPES, FORMATS, FIELDS } from '../constants';

interface SetupWizardTabProps {
    wizardStep: WizardStep;
    setWizardStep: (step: WizardStep) => void;
    wizardData: {
        type: string;
        endpoint: string;
        format: string;
        field: string;
        frequency: string;
    };
    setWizardData: React.Dispatch<React.SetStateAction<{
        type: string;
        endpoint: string;
        format: string;
        field: string;
        frequency: string;
    }>>;
    setTab: (tab: Tab) => void;
}

export const SetupWizardTab: React.FC<SetupWizardTabProps> = ({
    wizardStep,
    setWizardStep,
    wizardData,
    setWizardData,
    setTab
}) => {
    return (
        <div className="space-y-6">
            {/* Step Progress */}
            <div className="flex items-center gap-2">
                {(['Instrument Type', 'API Config', 'Field Mapping', 'Confirm'].map((label, i) => (
                    <React.Fragment key={label}>
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold ${i === wizardStep ? 'text-rose-300' : i < wizardStep ? 'text-emerald-400' : 'text-slate-600'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border ${i === wizardStep ? 'border-rose-500 bg-rose-900/30 text-rose-300' : i < wizardStep ? 'border-emerald-700 bg-emerald-900/30 text-emerald-400' : 'border-slate-700 text-slate-600'}`}>
                                {i < wizardStep ? '✓' : i + 1}
                            </div>
                            <span className="hidden sm:block">{label}</span>
                        </div>
                        {i < 3 && <div className="flex-1 h-px bg-slate-800" />}
                    </React.Fragment>
                )))}
            </div>

            {wizardStep === 0 && (
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Select Instrument Type</p>
                    <div className="space-y-2">
                        {INSTRUMENT_TYPES.map(t => (
                            <button key={t} onClick={() => setWizardData(d => ({ ...d, type: t }))}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-all ${wizardData.type === t ? 'bg-rose-900/20 border-rose-700/50 text-rose-200' : 'bg-black/30 border-purple-900/30 text-slate-400 hover:border-rose-800/40'}`}>
                                <div className={`w-2 h-2 rounded-full shrink-0 ${wizardData.type === t ? 'bg-rose-400' : 'bg-slate-700'}`} />
                                {t}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setWizardStep(1)}
                        className="flex items-center gap-2 bg-rose-700 hover:bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {wizardStep === 1 && (
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">API / Connection Config</p>
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Endpoint URL</label>
                        <input value={wizardData.endpoint} onChange={e => setWizardData(d => ({ ...d, endpoint: e.target.value }))}
                            placeholder="https://lab-system.csu.edu/api/data"
                            className="w-full mt-1 bg-black/40 border border-rose-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-rose-500/60" />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Data Format</label>
                        <select value={wizardData.format} onChange={e => setWizardData(d => ({ ...d, format: e.target.value }))}
                            className="w-full mt-1 bg-black/40 border border-rose-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none">
                            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Contribution Frequency (min)</label>
                        <input type="number" value={wizardData.frequency} onChange={e => setWizardData(d => ({ ...d, frequency: e.target.value }))} min={5}
                            className="w-full mt-1 bg-black/40 border border-rose-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setWizardStep(0)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm font-bold hover:bg-slate-800 transition-colors">Back</button>
                        <button onClick={() => setWizardStep(2)} className="flex items-center gap-2 bg-rose-700 hover:bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">Next <ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}

            {wizardStep === 2 && (
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Field & Schema Mapping</p>
                    <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Geographic Assignment (Ground Truth For)</label>
                        <select value={wizardData.field} onChange={e => setWizardData(d => ({ ...d, field: e.target.value }))}
                            className="w-full mt-1 bg-black/40 border border-rose-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none">
                            {FIELDS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>
                    <div className="bg-black/40 border border-purple-900/30 rounded-xl p-4">
                        <p className="text-[10px] text-slate-500 mb-3">Map instrument fields → FarmSense schema</p>
                        {[['moisture_pct', 'SWC (%)'], ['conductivity', 'EC (dS/m)'], ['soil_tension', 'SMP (bars)']].map(([src, dest]) => (
                            <div key={src} className="flex items-center gap-2 text-xs py-2 border-b border-purple-900/10 last:border-0">
                                <span className="font-mono text-slate-400 w-32">{src}</span>
                                <ChevronRight className="w-3 h-3 text-slate-600" />
                                <span className="font-bold text-rose-400">{dest}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setWizardStep(1)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm font-bold hover:bg-slate-800 transition-colors">Back</button>
                        <button onClick={() => setWizardStep(3)} className="flex items-center gap-2 bg-rose-700 hover:bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">Next <ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}

            {wizardStep === 3 && (
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Confirm & Activate</p>
                    <div className="bg-black/40 border border-rose-900/30 rounded-xl p-4 space-y-2 text-xs">
                        {[['Type', wizardData.type], ['Format', wizardData.format], ['Frequency', `Every ${wizardData.frequency} min`], ['Field', FIELDS.find(f => f.id === wizardData.field)?.name ?? '—']].map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                                <span className="text-slate-500">{k}</span>
                                <span className="text-white font-medium">{v}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setWizardStep(2)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm font-bold hover:bg-slate-800 transition-colors">Back</button>
                        <button onClick={() => { setTab('registry'); setWizardStep(0); }}
                            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                            <CheckCircle2 className="w-4 h-4" /> Activate Integration
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
