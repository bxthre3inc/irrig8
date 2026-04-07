import { useState } from 'react';
import { BookOpen, MessageSquarePlus, Star, ChevronDown, ChevronRight, Send, Trash2, Building2, Tag } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface ReviewNote {
    id: string;
    author: string;
    org: string;
    timestamp: string;
    text: string;
    section: string;
    rating?: number;  // 1-5 optional rating on sections
}

interface ApplicationSection {
    id: string;
    title: string;
    content: string;
    tags: string[];
}

interface SubmittedApplication {
    id: string;
    grantTitle: string;
    funder: string;
    submittedBy: string;
    submittedAt: string;
    ask: number;
    sections: ApplicationSection[];
    notes: ReviewNote[];
}

// Seed data — in production fetched from GET /api/v1/grants/submissions
const SEED_APPS: SubmittedApplication[] = [
    {
        id: 'SUB-001',
        grantTitle: 'Federal Federal ESG — Water Resilience on Federal Installations',
        funder: 'Federal Federal ESG',
        submittedBy: 'FarmSense',
        submittedAt: '2026-02-20T14:30:00Z',
        ask: 2400000,
        sections: [
            { id: 's1', title: 'Executive Summary', tags: ['overview', 'impact'], content: 'FarmSense deploys a dual-layer precision soil moisture network across Federal installation perimeters to reduce dependence on stressed Ogallala aquifer groundwater. Real-time DHU telemetry feeds an AI-driven demand forecasting model, reducing extraction by a projected 28–34% versus baseline. Phase I targets Fort Carson, CO — a high-water-stress installation with critical training corridor dependencies on SLV aquifer health.' },
            { id: 's2', title: 'Technical Approach', tags: ['engineering', 'AI', 'sensors'], content: 'Three-tier sensor network: Precision Field Anchor (PFA) nodes at 50m spacing, District Hub Units (DHU) aggregating at section level, Regional Superstations (RSS) syncing to the cloud. ML Kriging interpolates soil moisture between nodes enabling variable-rate irrigation scheduling. Dual-layer spatial privacy ensures compliance with Federal data classification requirements for field topology.' },
            { id: 's3', title: 'Projected Impact', tags: ['water', 'cost savings', 'metrics'], content: 'Expected outcomes over 24-month performance period: 28–34% groundwater extraction reduction (400–520 acre-feet/yr at Fort Carson scale), $1.2–1.8M annual water cost avoidance, reduction in irrigation labor hours by ~60%, and certification-ready GLOBALG.A.P. water audit trail.' },
            { id: 's4', title: 'Team & Qualifications', tags: ['personnel', 'credentials'], content: 'Principal Investigator with 12+ years precision agriculture systems engineering. Software team experienced in Federal-compliant data handling (ITAR awareness, CUI protocols). Hardware team holds NDAA Section 889 compliance certifications for all component sourcing.' },
        ],
        notes: [
            { id: 'n1', author: 'Internal Reviewer', org: 'FarmSense', timestamp: '2026-02-21T10:00:00Z', text: 'The 28–34% reduction claim needs a citation or pilot data reference. Add SLV aquifer drawdown rate data from the 2024 Colorado Water Conservation Board report.', section: 'Executive Summary' },
        ],
    },
    {
        id: 'SUB-002',
        grantTitle: 'LOR Foundation — Water Stewardship Rural Resilience',
        funder: 'LOR Foundation',
        submittedBy: 'FarmSense',
        submittedAt: '2026-02-22T09:00:00Z',
        ask: 150000,
        sections: [
            { id: 's1', title: 'Project Description', tags: ['overview', 'community'], content: 'A farmer-owned data sovereignty platform serving 14 SLV grower families. Each participating grower retains full ownership of their sensor data under a FarmSense data trust agreement. The platform provides per-field water dashboards, GLOBALG.A.P. pre-audit checklists, and shared basin analytics that protect individual field privacy.' },
            { id: 's2', title: 'Community Impact', tags: ['equity', 'rural', 'SLV'], content: 'Participating farms collectively irrigate 2,800 acres of SLV row crops. Network-wide water monitoring enables collective bargaining for water rights, early drought alerts, and cooperative water trading. Minority and first-generation farm families constitute 9 of 14 participants.' },
        ],
        notes: [],
    },
];

function StarRating({ value, onChange }: { value?: number; onChange: (r: number) => void }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => onChange(s)}
                    className={`w-4 h-4 transition-colors ${(value ?? 0) >= s ? 'text-amber-400' : 'text-slate-700 hover:text-amber-500'}`}>
                    <Star className="w-4 h-4 fill-current" />
                </button>
            ))}
        </div>
    );
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function GrantReviewerView() {
    const { user } = useAuth();
    const [apps, setApps] = useState(SEED_APPS);
    const [selectedApp, setSelectedApp] = useState<SubmittedApplication | null>(apps[0]);
    const [expandedSection, setExpandedSection] = useState<string | null>('s1');
    const [noteSection, setNoteSection] = useState<string>('');
    const [noteText, setNoteText] = useState('');
    const [sectionRatings, setSectionRatings] = useState<Record<string, number>>({});

    const addNote = (appId: string, sectionId: string, sectionTitle: string) => {
        if (!noteText.trim()) return;
        const newNote: ReviewNote = {
            id: `n${Date.now()}`,
            author: user?.name ?? 'Reviewer',
            org: user?.org ?? '',
            timestamp: new Date().toISOString(),
            text: noteText.trim(),
            section: sectionTitle,
            rating: sectionRatings[sectionId],
        };
        setApps(prev => prev.map(a => a.id === appId ? { ...a, notes: [...a.notes, newNote] } : a));
        if (selectedApp?.id === appId) {
            setSelectedApp(prev => prev ? { ...prev, notes: [...prev.notes, newNote] } : prev);
        }
        setNoteText('');
        setNoteSection('');
    };

    const deleteNote = (appId: string, noteId: string) => {
        setApps(prev => prev.map(a => a.id === appId ? { ...a, notes: a.notes.filter(n => n.id !== noteId) } : a));
        if (selectedApp?.id === appId) {
            setSelectedApp(prev => prev ? { ...prev, notes: prev.notes.filter(n => n.id !== noteId) } : prev);
        }
    };

    return (
        <div className="flex h-full">
            {/* Application list */}
            <aside className="w-72 border-r border-slate-800 flex flex-col shrink-0">
                <div className="px-5 py-4 border-b border-slate-800">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Review Queue</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{apps.length} submissions</p>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                    {apps.map(app => (
                        <button key={app.id} onClick={() => setSelectedApp(app)}
                            className={`w-full text-left px-5 py-3 border-l-2 transition-all ${selectedApp?.id === app.id ? 'border-indigo-500 bg-indigo-900/10' : 'border-transparent hover:bg-slate-900/50'}`}>
                            <p className="text-xs font-bold text-white leading-snug">{app.grantTitle}</p>
                            <p className="text-[10px] text-slate-500 mt-1">{app.funder} · {fmtDate(app.submittedAt)}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                    ${(app.ask / 1000).toFixed(0)}K ask
                                </span>
                                {app.notes.length > 0 && (
                                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-800/40">
                                        {app.notes.length} note{app.notes.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Application content + notes */}
            {selectedApp ? (
                <div className="flex-1 overflow-y-auto">
                    <div className="px-8 py-6 max-w-4xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="border-b border-slate-800 pb-5">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{selectedApp.funder}</p>
                            <h2 className="text-xl font-black text-white">{selectedApp.grantTitle}</h2>
                            <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-slate-500">
                                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />Submitted by {selectedApp.submittedBy}</span>
                                <span>{fmtDate(selectedApp.submittedAt)}</span>
                                <span className="text-indigo-400 font-bold">${(selectedApp.ask / 1000).toFixed(0)}K request</span>
                            </div>
                        </div>

                        {/* Sections */}
                        {selectedApp.sections.map(sec => (
                            <div key={sec.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-800/30 transition-colors"
                                    onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}>
                                    <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <span className="text-sm font-bold text-white flex-1 text-left">{sec.title}</span>
                                    <div className="flex items-center gap-2">
                                        {sec.tags.map(t => (
                                            <span key={t} className="text-[9px] font-bold text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                                <Tag className="w-2.5 h-2.5" />{t}
                                            </span>
                                        ))}
                                        {expandedSection === sec.id ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                                    </div>
                                </button>

                                {expandedSection === sec.id && (
                                    <div className="px-5 pb-5 space-y-4 border-t border-slate-800">
                                        {/* Content */}
                                        <p className="text-sm text-slate-300 leading-relaxed pt-4">{sec.content}</p>

                                        {/* Existing notes on this section */}
                                        {selectedApp.notes.filter(n => n.section === sec.title).length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reviewer Notes</p>
                                                {selectedApp.notes.filter(n => n.section === sec.title).map(note => (
                                                    <div key={note.id} className="bg-amber-950/20 border border-amber-900/30 rounded-lg px-4 py-3 flex gap-3">
                                                        <MessageSquarePlus className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[10px] font-bold text-amber-300">{note.author}</span>
                                                                <span className="text-[9px] text-slate-600">{note.org}</span>
                                                                {note.rating && <StarRating value={note.rating} onChange={() => { }} />}
                                                                <span className="text-[9px] text-slate-600 ml-auto">{fmtDate(note.timestamp)}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-300">{note.text}</p>
                                                        </div>
                                                        <button onClick={() => deleteNote(selectedApp.id, note.id)}
                                                            className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add note */}
                                        <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Add Note</p>
                                                <StarRating
                                                    value={sectionRatings[sec.id]}
                                                    onChange={r => setSectionRatings(prev => ({ ...prev, [sec.id]: r }))}
                                                />
                                            </div>
                                            <textarea
                                                value={noteSection === sec.id ? noteText : ''}
                                                onChange={e => { setNoteSection(sec.id); setNoteText(e.target.value); }}
                                                placeholder={`Add your review note for "${sec.title}"…`}
                                                rows={2}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none"
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => addNote(selectedApp.id, sec.id, sec.title)}
                                                    disabled={!noteText.trim() || noteSection !== sec.id}
                                                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 px-4 py-1.5 rounded-lg transition-colors">
                                                    <Send className="w-3 h-3" /> Submit Note
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">Select a submission to review.</div>
            )}
        </div>
    );
}
