import React from 'react';
import { corrLabels, corrMatrix } from '../constants';
import { corrColor } from '../helpers';

export const CorrelationTab: React.FC = () => {
    return (
        <div className="space-y-5">
            <div className="bg-black/40 border border-purple-900/30 rounded-xl p-5">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Pearson Correlation Matrix</p>
                <p className="text-[10px] text-slate-500 mb-5">Satellite layers vs. ground sensor types within drawn polygon</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-center text-[11px] font-mono">
                        <thead>
                            <tr>
                                <th className="pb-3 text-slate-600 text-left w-16"></th>
                                {corrLabels.map(l => <th key={l} className="pb-3 text-purple-400 font-bold">{l}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {corrLabels.map((row, i) => (
                                <tr key={row}>
                                    <td className="py-1 text-left text-purple-400 font-bold pr-3">{row}</td>
                                    {corrLabels.map((_, j) => (
                                        <td key={j} className="py-1 px-1">
                                            <div className={`rounded-md py-1.5 px-2 font-bold ${corrColor(corrMatrix[i][j])}`}>
                                                {corrMatrix[i][j].toFixed(2)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-900/30 flex gap-4 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-600 inline-block" />Strong (≥0.8)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-800/70 inline-block" />Moderate (≥0.6)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-900/50 inline-block" />Weak (≥0.4)</span>
                </div>
            </div>

            <div className="bg-black/40 border border-purple-900/30 rounded-xl p-5">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Polygon AOI</p>
                <div className="h-28 rounded-lg border border-dashed border-blue-900/40 flex items-center justify-center text-slate-600 text-xs">
                    [ Map polygon drawing — connects to MapLibre GL layer ]
                </div>
            </div>
        </div>
    );
};
