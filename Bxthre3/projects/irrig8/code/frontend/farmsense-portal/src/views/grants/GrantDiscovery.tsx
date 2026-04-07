import React, { useState, useEffect, useCallback } from 'react';
import { Search, ExternalLink, Bookmark, BookmarkCheck, Zap, Calendar, DollarSign, ChevronRight, RefreshCw } from 'lucide-react';

type SortKey = 'relevance' | 'deadline' | 'amount';

interface GrantSource {
    id: string;
    name: string;
    url: string;
    category: string;
    notes: string | null;
}

// Mirrors src/data/grant-sources.json — update both in sync
const SOURCES: GrantSource[] = [
    { id: 'estcp',          name: 'Federal Federal ESG',                          url: 'https://www.serdp-estcp.mil',         category: 'Federal',          notes: null },
    { id: 'usda-nrcs-eqip', name: 'USDA NRCS EQIP',                    url: 'https://www.nrcs.usda.gov',           category: 'USDA',         notes: null },
    { id: 'usda-ars-cris',  name: 'USDA ARS CRIS',                      url: 'https://www.ars.usda.gov',            category: 'USDA',         notes: null },
    { id: 'nsf-iucrc',      name: 'NSF IUCRC',                          url: 'https://new.nsf.gov',                 category: 'NSF',          notes: null },
    { id: 'gates-agdev',    name: 'Gates Foundation — Ag Development',  url: 'https://www.gatesfoundation.org',     category: 'Foundation',   notes: null },
    { id: 'lor-foundation', name: 'LOR Foundation',                     url: 'https://lorfoundation.org',           category: 'Foundation',   notes: null },
    { id: 'earthshot',      name: 'Earthshot Prize',                    url: 'https://earthshotprize.org',          category: 'International',notes: null },
    { id: 'wfp-borlaug',    name: 'World Food Prize — Borlaug Field Award', url: 'https://www.worldfoodprize.org',  category: 'International',notes: null },
    { id: 'cwcb',           name: 'Colorado Water Conservation Board',  url: 'https://cwcb.colorado.gov',           category: 'State — CO',   notes: null },
    { id: 'slv-rc',         name: 'SLV Regional Council',               url: 'https://slvrc.org',                   category: 'Regional',     notes: null },
];

interface Opportunity {
    id: string;
    sourceId: string;
    title: string;
    funderName: string;
    program: string;
    deadline: string;
    awardMin: number;
    awardMax: number;
    relevance: number;
    tags: string[];
    description: string;
    url: string;
    saved: boolean;
}

// Seed opportunities — keyed by sourceId to match grant-sources.json
const SEED_OPPORTUNITIES: Opportunity[] = [
    { id: 'Federal ESG-FY26-IR', sourceId: 'estcp', title: 'Water Resilience on Federal Installations', funderName: 'Federal Federal ESG', program: 'Installation Resilience', deadline: '2026-03-26', awardMin: 1500000, awardMax: 3000000, relevance: 97, tags: ['groundwater', 'resilience', 'sensing', 'aquifer'], description: 'Certifies technologies that reduce Federal installation dependence on stressed groundwater basins through real-time monitoring and AI-driven demand forecasting.', url: 'https://www.serdp-estcp.mil', saved: true },
    { id: 'USDA-NRCS-EQIP-26', sourceId: 'usda-nrcs-eqip', title: 'EQIP — Water Conservation Priority', funderName: 'USDA NRCS EQIP', program: 'EQIP', deadline: '2026-04-15', awardMin: 50000, awardMax: 450000, relevance: 88, tags: ['water conservation', 'precision agriculture', 'soil health'], description: 'Technical and financial assistance to agricultural operations implementing conservation practices that address priority resource concerns, including water depletion.', url: 'https://www.nrcs.usda.gov/programs-initiatives/eqip-environmental-quality-incentives', saved: false },
    { id: 'NSF-IUCRC-26', sourceId: 'nsf-iucrc', title: 'IUCRC — Water, Sustainability, Climate', funderName: 'NSF IUCRC', program: 'IUCRC', deadline: '2026-05-01', awardMin: 300000, awardMax: 1200000, relevance: 79, tags: ['university partnership', 'water', 'climate', 'federated data'], description: 'Establishes long-term partnerships between universities, industry, and government around shared water and climate research infrastructure.', url: 'https://new.nsf.gov/funding/opportunities/industry-university-cooperative-research-centers', saved: false },
    { id: 'GATES-COP30-AI', sourceId: 'gates-agdev', title: 'COP30 Smallholder Climate Adaptation — AI & Digital Agriculture', funderName: 'Gates Foundation — Ag Development', program: 'Agricultural Development', deadline: '2026-06-30', awardMin: 500000, awardMax: 5000000, relevance: 74, tags: ['smallholder', 'climate adaptation', 'AI', 'irrigation'], description: 'Seeking scalable digital agriculture platforms that demonstrably reduce water use and improve yield resilience for smallholder farmers in climate-stressed regions.', url: 'https://www.gatesfoundation.org/our-work/programs/global-growth-opportunity', saved: false },
    { id: 'LOR-INTRO', sourceId: 'lor-foundation', title: 'Water Stewardship — Rural Resilience Grants', funderName: 'LOR Foundation', program: 'Water Stewardship', deadline: '2026-06-01', awardMin: 50000, awardMax: 500000, relevance: 91, tags: ['water', 'rural', 'SLV', 'stewardship', 'groundwater'], description: 'Supports innovative approaches to rural water stewardship, with special interest in the San Luis Valley aquifer region and farmer-owned data sovereignty platforms.', url: 'https://lorfoundation.org', saved: true },
    { id: 'EARTHSHOT-WATER', sourceId: 'earthshot', title: 'Earthshot Prize — Fix Our Climate', funderName: 'Earthshot Prize', program: 'Fix Our Climate', deadline: '2026-07-15', awardMin: 1000000, awardMax: 1000000, relevance: 68, tags: ['climate', 'water', 'conservation', 'impact'], description: 'Annual prize fund for the most innovative solutions that repair and regenerate the natural environment. Water stewardship and aquifer restoration are priority areas.', url: 'https://earthshotprize.org', saved: false },
    { id: 'USDA-ARS-CRIS', sourceId: 'usda-ars-cris', title: 'Precision Agriculture Water Use Efficiency', funderName: 'USDA ARS CRIS', program: 'CRIS Cooperative Agreement', deadline: '2026-08-01', awardMin: 200000, awardMax: 800000, relevance: 83, tags: ['precision agriculture', 'water efficiency', 'sensor', 'kriging'], description: 'Cooperative agreements to develop and validate precision water management tools, including spatial interpolation and real-time soil moisture sensing networks.', url: 'https://www.ars.usda.gov', saved: false },
    { id: 'WFP-PRIZE-2027', sourceId: 'wfp-borlaug', title: 'Borlaug Field Award', funderName: 'World Food Prize — Borlaug Field Award', program: 'Borlaug Field Award', deadline: '2026-12-01', awardMin: 10000, awardMax: 10000, relevance: 62, tags: ['food security', 'agriculture', 'impact', 'recognition'], description: 'Recognizes early-career individuals who have made exceptional contributions to improving food security through agricultural development or research.', url: 'https://www.worldfoodprize.org', saved: false },
    { id: 'CWCB-2026', sourceId: 'cwcb', title: 'Colorado Water Conservation Board — Implementation Grants', funderName: 'Colorado Water Conservation Board', program: 'Water Efficiency', deadline: '2026-09-15', awardMin: 25000, awardMax: 300000, relevance: 85, tags: ['colorado', 'water efficiency', 'conservation', 'SLV'], description: 'State-level grants for Colorado water conservation and resilience projects. SLV basin projects receive priority review.', url: 'https://cwcb.colorado.gov/grants-loans', saved: false },
];

const sources: GrantSource[] = SOURCES as GrantSource[];
const ALL_FUNDERS = ['All', ...sources.map(s => s.name)];

function daysUntil(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }
function fmtAmount(min: number, max: number) {
    const fmt = (n: number) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`;
    return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
}

function RelevanceBadge({ score }: { score: number }) {
    const color = score >= 85 ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50' :
        score >= 70 ? 'bg-amber-900/30 text-amber-400 border-amber-800/40' :
            'bg-slate-800 text-slate-400 border-slate-700';
    return <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded border ${color}`}><Zap className="w-2.5 h-2.5" />{score}% match</div>;
}

function DeadlineBadge({ dateStr }: { dateStr: string }) {
    const d = daysUntil(dateStr);
    const color = d <= 30 ? 'text-red-400' : d <= 60 ? 'text-amber-400' : 'text-slate-400';
    return <span className={`text-[10px] font-bold ${color}`}>{d}d · {new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>;
}

const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const LAST_REFRESH_KEY = 'farmsense_grants_last_refresh';

export const GrantDiscovery: React.FC = () => {
    const [search, setSearch] = useState('');
    const [funder, setFunder] = useState('All');
    const [sort, setSort] = useState<SortKey>('relevance');
    const [opportunities, setOpportunities] = useState<Opportunity[]>(SEED_OPPORTUNITIES);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Determine last refresh from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(LAST_REFRESH_KEY);
        if (stored) {
            const d = new Date(stored);
            setLastRefreshed(d);
            // If more than 24h old, auto-refresh
            if (Date.now() - d.getTime() > REFRESH_INTERVAL_MS) {
                refresh();
            }
        } else {
            refresh();
        }
    }, []);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        // Stub: in production this calls GET /api/v1/grants/discover?sources=...
        // sourced from grant-sources.json. For now simulate a network delay.
        await new Promise(r => setTimeout(r, 800));
        const now = new Date();
        setLastRefreshed(now);
        localStorage.setItem(LAST_REFRESH_KEY, now.toISOString());
        setRefreshing(false);
        // In production: setOpportunities(fetchedData)
    }, []);

    const toggleSave = (id: string) => setOpportunities(prev => prev.map(o => o.id === id ? { ...o, saved: !o.saved } : o));

    const filtered = opportunities
        .filter(o => funder === 'All' || o.funderName === funder)
        .filter(o => !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) || o.funderName.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => sort === 'relevance' ? b.relevance - a.relevance : sort === 'deadline' ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime() : b.awardMax - a.awardMax);

    const formatRefreshed = (d: Date) => {
        const diff = Math.round((Date.now() - d.getTime()) / 60000);
        if (diff < 1) return 'just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
        return d.toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            {/* Refresh banner */}
            <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-indigo-400' : 'text-slate-600'}`} />
                <span>{refreshing ? 'Refreshing from sources…' : `Last updated: ${lastRefreshed ? formatRefreshed(lastRefreshed) : '—'}`}</span>
                <span className="text-slate-700">·</span>
                <span className="text-slate-600">Refreshes daily from <span className="text-slate-500">{sources.length} sources</span></span>
                <button onClick={refresh} className="ml-auto text-indigo-400 hover:text-indigo-300 font-bold transition-colors" disabled={refreshing}>
                    Refresh now
                </button>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search grants, keywords, funders…"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
                </div>
                <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none">
                    <option value="relevance">Sort: Relevance</option>
                    <option value="deadline">Sort: Deadline</option>
                    <option value="amount">Sort: Award Size</option>
                </select>
            </div>

            {/* Funder Tabs — driven by grant-sources.json */}
            <div className="flex gap-1 flex-wrap">
                {ALL_FUNDERS.map(f => (
                    <button key={f} onClick={() => setFunder(f)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${funder === f ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'}`}>
                        {f === 'All' ? 'All Sources' : f}
                    </button>
                ))}
                <span className="ml-auto text-[10px] text-slate-600 self-center">{filtered.length} results</span>
            </div>

            {/* Results */}
            <div className="space-y-2">
                {filtered.map(opp => (
                    <div key={opp.id} className={`bg-slate-900 border rounded-xl overflow-hidden transition-all ${opp.saved ? 'border-indigo-800/50' : 'border-slate-800 hover:border-slate-700'}`}>
                        <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(expanded === opp.id ? null : opp.id)}>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{opp.funderName}</span>
                                    <span className="text-slate-700">·</span>
                                    <span className="text-[9px] font-bold text-slate-500">{opp.program}</span>
                                </div>
                                <p className="text-sm font-bold text-white leading-snug">{opp.title}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <RelevanceBadge score={opp.relevance} />
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500"><Calendar className="w-2.5 h-2.5" /><DeadlineBadge dateStr={opp.deadline} /></div>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500"><DollarSign className="w-2.5 h-2.5" />{fmtAmount(opp.awardMin, opp.awardMax)}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 pt-0.5">
                                <button onClick={e => { e.stopPropagation(); toggleSave(opp.id); }}
                                    className={`transition-colors ${opp.saved ? 'text-indigo-400' : 'text-slate-600 hover:text-indigo-400'}`}>
                                    {opp.saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                </button>
                                <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${expanded === opp.id ? 'rotate-90' : ''}`} />
                            </div>
                        </div>
                        {expanded === opp.id && (
                            <div className="border-t border-slate-800 px-4 pb-4 pt-3 space-y-3">
                                <p className="text-sm text-slate-400">{opp.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {opp.tags.map(t => <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{t}</span>)}
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <a href={opp.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-slate-500 transition-colors">
                                        <ExternalLink className="w-3 h-3" /> Program Page
                                    </a>
                                    <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition-colors">
                                        Start Application <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-slate-600 text-sm">No opportunities match your filters.</div>
                )}
            </div>
        </div>
    );
};

export default GrantDiscovery;
