import React from 'react';
import { X, Clock, FileText, ChevronRight } from 'lucide-react';
import { Application } from '../types';
import { daysUntil, fmtAsk, fmtSavedAt } from '../helpers';

interface ApplicationDetailDrawerProps {
    selected: Application;
    setSelected: (app: Application | null) => void;
    moveApp: (id: string, direction: 1 | -1) => void;
    setApps: React.Dispatch<React.SetStateAction<Application[]>>;
}

export const ApplicationDetailDrawer: React.FC<ApplicationDetailDrawerProps> = ({
    selected,
    setSelected,
    moveApp,
    setApps
}) => {
    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-950 border-l border-slate-800 z-50 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div>
                    <p className="font-bold text-white text-sm">{selected.grant}</p>
                    {selected.draftSavedAt && (
                        <p className="text-[10px] text-blue-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" /> Draft saved {fmtSavedAt(selected.draftSavedAt)}
                        </p>
                    )}
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                    {[['Agency', selected.agency], ['Stage', selected.stage], ['Ask', selected.ask > 0 ? fmtAsk(selected.ask) : 'TBD'], ['Deadline', `${daysUntil(selected.deadline)}d left`]].map(([k, v]) => (
                        <div key={k} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest">{k}</p>
                            <p className="text-sm font-bold text-white mt-0.5">{v}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Completion</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${selected.completionPct}%` }} /></div>
                        <span className="text-xs font-mono text-white">{selected.completionPct}%</span>
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Notes</p>
                    <p className="text-sm text-slate-400">{selected.notes || '—'}</p>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Documents ({selected.docs.length})</p>
                    {selected.docs.length === 0 ? <p className="text-xs text-slate-600">No documents attached.</p> : (
                        <ul className="space-y-1">{selected.docs.map(d => (
                            <li key={d} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                                <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />{d}
                            </li>
                        ))}</ul>
                    )}
                </div>

                <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Contacts</p>
                    {selected.contacts.length === 0 ? <p className="text-xs text-slate-600">No contacts logged.</p> : (
                        selected.contacts.map(c => (
                            <div key={c.name} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs">
                                <p className="font-bold text-white">{c.name}</p>
                                <p className="text-slate-500">{c.role}</p>
                                {c.email && <p className="text-indigo-400 font-mono mt-0.5">{c.email}</p>}
                            </div>
                        ))
                    )}
                </div>

                <div className="flex gap-2 flex-wrap pt-2">
                    <button onClick={() => { moveApp(selected.id, 1); setSelected(null); }}
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors">
                        Advance Stage <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setApps(prev => prev.map(a => a.id === selected.id ? { ...a, stage: 'Rejected' } : a)); setSelected(null); }}
                        className="text-xs font-bold text-red-400 border border-red-900/40 px-3 py-2 rounded-lg hover:bg-red-950/20 transition-colors">
                        Mark Rejected
                    </button>
                </div>
            </div>
        </div>
    );
};
