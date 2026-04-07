import React from 'react';
import { Integration } from '../types';
import { MOCK_INTEGRATIONS } from '../constants';
import { QScore } from './QScore';

interface ScoringTabProps {
    integrations: Integration[];
}

export const ScoringTab: React.FC<ScoringTabProps> = ({ integrations }) => {
    return (
        <div className="space-y-4">
            <p className="text-[10px] text-slate-500 mb-4">Instruments below 65% quality threshold are excluded from model training until recalibrated.</p>
            {integrations.map(int => (
                <div key={int.id} className={`bg-black/40 border rounded-xl p-4 ${int.qualityScore < 65 ? 'border-red-900/40' : int.qualityScore < 85 ? 'border-amber-900/30' : 'border-emerald-900/30'}`}>
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-sm font-bold text-white">{int.name}</p>
                            <p className="text-[10px] text-slate-500">{int.type}</p>
                        </div>
                        {int.qualityScore < 65 && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-950/30 border border-red-900/40 text-red-400">Excluded from training</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        {[
                            { dim: 'Timeliness', score: int.status === 'offline' ? 12 : int.qualityScore - 5 },
                            { dim: 'Sensor Agreement (MAE)', score: int.qualityScore + 2 },
                            { dim: 'Drift Detection', score: int.drift ? 48 : int.qualityScore - 1 },
                        ].map(d => (
                            <div key={d.dim}>
                                <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                                    <span>{d.dim}</span>
                                    <span className="font-mono">{Math.min(100, Math.max(0, d.score))}%</span>
                                </div>
                                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all"
                                        style={{ width: `${Math.min(100, Math.max(0, d.score))}%`, backgroundColor: d.score < 65 ? '#ef4444' : d.score < 85 ? '#fbbf24' : '#10b981' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-purple-900/20 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Composite quality</span>
                        <QScore score={int.qualityScore} />
                    </div>
                </div>
            ))}
        </div>
    );
};
