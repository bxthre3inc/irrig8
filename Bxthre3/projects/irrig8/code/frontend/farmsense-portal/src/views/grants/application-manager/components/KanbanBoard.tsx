import React from 'react';
import { DollarSign, Calendar, Paperclip, Clock } from 'lucide-react';
import { Application, Stage } from '../types';
import { STAGES, STAGE_COLORS, STAGE_HEADER } from '../constants';
import { daysUntil, fmtAsk, fmtSavedAt } from '../helpers';
import { UrgencyDot } from './UrgencyDot';

interface KanbanBoardProps {
    apps: Application[];
    setSelected: (app: Application) => void;
    moveApp: (id: string, direction: 1 | -1) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ apps, setSelected, moveApp }) => {
    return (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {STAGES.filter(s => s !== 'Rejected').map(stage => {
                const stageApps = apps.filter(a => a.stage === stage);
                return (
                    <div key={stage} className={`rounded-xl border p-3 min-h-[120px] ${STAGE_COLORS[stage]}`}>
                        <div className="flex items-center justify-between mb-3">
                            <p className={`text-[10px] font-black uppercase tracking-widest ${STAGE_HEADER[stage]}`}>{stage}</p>
                            <span className="text-[9px] font-bold text-slate-600 bg-slate-800 rounded-full px-1.5 py-0.5">{stageApps.length}</span>
                        </div>
                        <div className="space-y-2">
                            {stageApps.map(app => (
                                <div key={app.id} onClick={() => setSelected(app)}
                                    className="bg-slate-950/60 border border-slate-700/40 rounded-lg p-3 cursor-pointer hover:border-slate-600/60 transition-all group">
                                    <div className="flex items-start gap-1.5 mb-1.5">
                                        <UrgencyDot deadline={app.deadline} />
                                        <p className="text-xs font-bold text-slate-200 leading-tight flex-1">{app.grant}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-500">
                                        {app.ask > 0 && <span><DollarSign className="w-2.5 h-2.5 inline" />{fmtAsk(app.ask)}</span>}
                                        <span><Calendar className="w-2.5 h-2.5 inline" />{daysUntil(app.deadline)}d</span>
                                        <span><Paperclip className="w-2.5 h-2.5 inline" />{app.docs.length}</span>
                                    </div>
                                    {app.draftSavedAt && (
                                        <div className="flex items-center gap-1 mt-1.5 text-[9px] text-blue-500/70">
                                            <Clock className="w-2.5 h-2.5" /> Draft · saved {fmtSavedAt(app.draftSavedAt)}
                                        </div>
                                    )}
                                    <div className="w-full bg-slate-800 rounded-full h-0.5 mt-2">
                                        <div className="h-0.5 rounded-full bg-indigo-500 transition-all" style={{ width: `${app.completionPct}%` }} />
                                    </div>
                                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={e => { e.stopPropagation(); moveApp(app.id, -1); }} className="text-[8px] font-bold text-slate-500 hover:text-white border border-slate-700 px-1.5 py-0.5 rounded transition-colors">← Back</button>
                                        <button onClick={e => { e.stopPropagation(); moveApp(app.id, 1); }} className="text-[8px] font-bold text-slate-500 hover:text-white border border-slate-700 px-1.5 py-0.5 rounded transition-colors">Advance →</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
