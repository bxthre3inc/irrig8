import React from 'react';
import { Integration } from '../types';
import { MOCK_INTEGRATIONS } from '../constants';

interface CalibrationTabProps {
    selectedInt: Integration;
    setSelectedInt: (int: Integration) => void;
    calibAccepted: Set<string>;
    toggleCalibAccept: (id: string) => void;
}

export const CalibrationTab: React.FC<CalibrationTabProps> = ({
    selectedInt,
    setSelectedInt,
    calibAccepted,
    toggleCalibAccept
}) => {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
                <select value={selectedInt.id} onChange={e => setSelectedInt(MOCK_INTEGRATIONS.find(i => i.id === e.target.value) ?? MOCK_INTEGRATIONS[0])}
                    className="bg-black/40 border border-purple-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none">
                    {MOCK_INTEGRATIONS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[{ label: 'Offset Applied', value: '+0.8%', color: 'text-amber-400' }, { label: 'MAE vs Primary', value: '1.24 dS/m', color: 'text-white' }, { label: 'Drift', value: selectedInt.drift ? 'Detected' : 'None', color: selectedInt.drift ? 'text-red-400' : 'text-emerald-400' }].map(m => (
                    <div key={m.label} className="bg-black/40 border border-purple-900/30 rounded-xl p-4 text-center">
                        <p className={`text-2xl font-black font-mono ${m.color}`}>{m.value}</p>
                        <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-1">{m.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-black/40 border border-purple-900/30 rounded-xl p-5">
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-4">Auto-Calibration Proposals</p>
                <div className="space-y-3">
                    {[
                        { id: 'cal-1', var: 'EC (dS/m)', current: '1.14', corrected: '1.06', confidence: 'High' },
                        { id: 'cal-2', var: 'SWC (%)', current: '28.4', corrected: '27.1', confidence: 'Medium' },
                    ].map(c => (
                        <div key={c.id} className="flex items-center gap-4 px-3 py-3 bg-black/30 rounded-lg border border-purple-900/20">
                            <div className="flex-1">
                                <p className="text-xs font-bold text-white">{c.var}</p>
                                <p className="text-[10px] text-slate-500">Raw: <span className="font-mono text-slate-300">{c.current}</span> → Corrected: <span className="font-mono text-emerald-400">{c.corrected}</span> <span className="text-purple-500">({c.confidence} confidence)</span></p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => toggleCalibAccept(c.id)}
                                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${calibAccepted.has(c.id) ? 'bg-emerald-600/20 border-emerald-600/50 text-emerald-300' : 'border-slate-700 text-slate-400 hover:border-emerald-700/50'}`}>
                                    {calibAccepted.has(c.id) ? '✓ Accepted' : 'Accept'}
                                </button>
                                <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:border-red-700/40 hover:text-red-400 transition-all">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
