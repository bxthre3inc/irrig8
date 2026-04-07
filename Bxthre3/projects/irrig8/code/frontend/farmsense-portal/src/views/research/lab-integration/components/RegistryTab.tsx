import React from 'react';
import { Integration, Tab } from '../types';
import { StatusBadge } from './StatusBadge';
import { QScore } from './QScore';
import { AlertTriangle } from 'lucide-react';

interface RegistryTabProps {
    integrations: Integration[];
    setSelectedInt: (int: Integration) => void;
    setTab: (tab: Tab) => void;
}

export const RegistryTab: React.FC<RegistryTabProps> = ({ integrations, setSelectedInt, setTab }) => {
    return (
        <div className="space-y-3">
            {integrations.map(int => (
                <div key={int.id} onClick={() => { setSelectedInt(int); setTab('calibration'); }}
                    className="bg-black/40 border border-purple-900/20 rounded-xl p-4 hover:border-rose-800/40 cursor-pointer transition-colors group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                            <p className="text-sm font-bold text-white">{int.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{int.id} · {int.type}</p>
                        </div>
                        <StatusBadge status={int.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-[10px]">
                        <div>
                            <p className="text-slate-600 uppercase tracking-widest">Last Sync</p>
                            <p className="text-slate-300 font-mono mt-0.5">{int.lastSync}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 uppercase tracking-widest">Records</p>
                            <p className="text-slate-300 font-mono mt-0.5">{int.records.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 uppercase tracking-widest mb-0.5">Quality Score</p>
                            <QScore score={int.qualityScore} />
                        </div>
                    </div>
                    {int.drift && (
                        <div className="flex items-center gap-1.5 mt-3 text-[10px] text-amber-400 bg-amber-950/20 border border-amber-800/30 rounded-lg px-3 py-2">
                            <AlertTriangle className="w-3 h-3 shrink-0" /> Calibration drift detected — recalibration recommended
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
