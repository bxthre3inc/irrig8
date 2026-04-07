import React, { useState } from 'react';
import { Database, Filter, Eye, Code2, Quote, Award, Download } from 'lucide-react';

type Tab = 'catalog' | 'filter' | 'preview' | 'api' | 'citations';

const MOCK_DATASETS = [
    { id: 'DS-2024-001', name: 'SLV Basin — Alfalfa Season 2024', region: 'San Luis Valley, CO', dateRange: '2024-03-01 / 2024-10-31', sensors: ['Soil', 'Atmospheric', 'Satellite'], crop: 'Alfalfa', records: 2847291, sizeMb: 1842, doi: '10.57234/farmsense.2024.001', version: 'v2.1', quality: 97, validated: true, license: 'CC-BY 4.0' },
    { id: 'DS-2024-002', name: 'SLV — Corn Moisture Profile 2024', region: 'Alamosa, CO', dateRange: '2024-05-15 / 2024-09-15', sensors: ['Soil', 'Drone'], crop: 'Corn', records: 921043, sizeMb: 512, doi: '10.57234/farmsense.2024.002', version: 'v1.0', quality: 91, validated: false, license: 'CC-BY 4.0' },
    { id: 'DS-2023-005', name: 'Pilot — Multi-Crop Water Ledger', region: 'Center, CO', dateRange: '2023-01-01 / 2023-12-31', sensors: ['Soil', 'Atmospheric', 'Satellite', 'IoT'], crop: 'Mixed', records: 5102884, sizeMb: 3201, doi: '10.57234/farmsense.2023.005', version: 'v3.2', quality: 99, validated: true, license: 'CC-BY 4.0' },
];

const SENSOR_TYPES = ['Soil', 'Atmospheric', 'Satellite', 'Drone', 'IoT'];
const CROPS = ['All', 'Alfalfa', 'Corn', 'Wheat', 'Mixed'];

function QualityBadge({ score, validated }: { score: number; validated: boolean }) {
    const color = score >= 95 ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20' : score >= 85 ? 'text-amber-400 border-amber-900/50 bg-amber-950/20' : 'text-red-400 border-red-900/50 bg-red-950/20';
    return (
        <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${color}`}>{score}% QA</span>
            {validated && <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-blue-400 border-blue-900/50 bg-blue-950/20 flex items-center gap-1"><Award className="w-2.5 h-2.5" />Peer Validated</span>}
        </div>
    );
}

export const OpenDataRepository: React.FC = () => {
    const [tab, setTab] = useState<Tab>('catalog');
    const [filterCrop, setFilterCrop] = useState('All');
    const [filterSensors, setFilterSensors] = useState<Set<string>>(new Set());
    const [previewDs, setPreviewDs] = useState(MOCK_DATASETS[0]);
    const [apiToken] = useState('Bearer fs_rsch_' + Math.random().toString(36).slice(2, 14));

    const toggleSensor = (s: string) => setFilterSensors(prev => {
        const next = new Set(prev);
        next.has(s) ? next.delete(s) : next.add(s);
        return next;
    });

    const filteredDs = MOCK_DATASETS.filter(ds =>
        (filterCrop === 'All' || ds.crop === filterCrop) &&
        (filterSensors.size === 0 || ds.sensors.some(s => filterSensors.has(s)))
    );

    return (
        <div className="bg-[#070511] rounded-xl border border-purple-900/30 overflow-hidden flex flex-col min-h-[680px]">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-900/30 bg-black/30">
                <div className="bg-indigo-600/20 p-2 rounded-lg"><Database className="w-5 h-5 text-indigo-400" /></div>
                <div>
                    <h2 className="font-bold text-white text-sm tracking-wide">Open Data Repository</h2>
                    <p className="text-[10px] text-indigo-500 font-mono uppercase tracking-widest">Privacy-preserving anonymized research datasets</p>
                </div>
                <span className="ml-auto text-[10px] font-mono text-slate-600">{MOCK_DATASETS.length} datasets available</span>
            </div>

            <div className="flex border-b border-purple-900/20 bg-black/20 px-6 overflow-x-auto">
                {([['catalog', 'Catalog', Database], ['filter', 'Filter', Filter], ['preview', 'Preview', Eye], ['api', 'API Access', Code2], ['citations', 'Citations', Quote]] as [Tab, string, any][]).map(([id, label, Icon]) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`py-3 px-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${tab === id ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                        <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {tab === 'catalog' && (
                    <div className="space-y-3">
                        {filteredDs.map(ds => (
                            <div key={ds.id} className="bg-black/40 border border-purple-900/20 rounded-xl p-4 hover:border-indigo-700/40 transition-colors group">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-mono text-indigo-500">{ds.id}</span>
                                            <span className="text-[10px] text-slate-600">·</span>
                                            <span className="text-[10px] text-slate-500">{ds.version}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white mb-1">{ds.name}</h3>
                                        <div className="flex flex-wrap gap-3 text-[10px] text-slate-500">
                                            <span>{ds.region}</span>
                                            <span>{ds.dateRange}</span>
                                            <span>{(ds.records / 1e6).toFixed(2)}M records</span>
                                            <span>{ds.sizeMb >= 1000 ? `${(ds.sizeMb / 1000).toFixed(1)} GB` : `${ds.sizeMb} MB`}</span>
                                            <span>{ds.license}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {ds.sensors.map(s => <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-400 border border-purple-900/40">{s}</span>)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <QualityBadge score={ds.quality} validated={ds.validated} />
                                        <div className="flex gap-1.5">
                                            <button onClick={() => { setPreviewDs(ds); setTab('preview'); }} className="text-[10px] font-bold text-purple-400 border border-purple-900/40 rounded px-2 py-1 hover:border-purple-500/60 transition-colors"><Eye className="w-3 h-3 inline mr-1" />Preview</button>
                                            <button className="text-[10px] font-bold text-indigo-400 border border-indigo-900/40 rounded px-2 py-1 hover:border-indigo-500/60 transition-colors"><Download className="w-3 h-3 inline mr-1" />Download</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'filter' && (
                    <div className="space-y-5">
                        <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Crop Category</p>
                            <div className="flex flex-wrap gap-2">
                                {CROPS.map(c => (
                                    <button key={c} onClick={() => setFilterCrop(c)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterCrop === c ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200' : 'bg-black/30 border-purple-900/30 text-slate-400 hover:border-indigo-700/40'}`}>{c}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Sensor Types</p>
                            <div className="flex flex-wrap gap-2">
                                {SENSOR_TYPES.map(s => (
                                    <button key={s} onClick={() => toggleSensor(s)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterSensors.has(s) ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200' : 'bg-black/30 border-purple-900/30 text-slate-400 hover:border-indigo-700/40'}`}>{s}</button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-black/30 border border-purple-900/20 rounded-xl p-4">
                            <p className="text-xs text-slate-400">Showing <span className="text-white font-bold">{filteredDs.length}</span> of {MOCK_DATASETS.length} datasets</p>
                        </div>
                        <button onClick={() => setTab('catalog')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors">Apply Filter</button>
                    </div>
                )}

                {tab === 'preview' && (
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-white">{previewDs.name}</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[['Records', `${(previewDs.records / 1e6).toFixed(2)}M`], ['Missing Data', '1.3%'], ['Primary Var.', 'SWC, SMP, EC'], ['Completeness', `${previewDs.quality}%`]].map(([k, v]) => (
                                <div key={k} className="bg-black/40 border border-purple-900/30 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-500">{k}</p>
                                    <p className="text-sm font-bold font-mono text-white mt-0.5">{v}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-black/40 border border-purple-900/30 rounded-xl p-4">
                            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">Variable Distributions (Sample)</p>
                            {[{ name: 'SWC', mean: 27.4, std: 5.2, p5: 18.1, p95: 38.9 }, { name: 'SMP', mean: -0.81, std: 0.34, p5: -1.55, p95: -0.28 }, { name: 'EC', mean: 1.12, std: 0.28, p5: 0.67, p95: 1.79 }].map(v => (
                                <div key={v.name} className="flex items-center gap-3 py-2 border-b border-purple-900/10 last:border-0 text-[10px]">
                                    <span className="text-slate-300 font-bold w-8">{v.name}</span>
                                    <span className="text-slate-500">μ: <span className="text-white">{v.mean}</span></span>
                                    <span className="text-slate-500">σ: <span className="text-white">{v.std}</span></span>
                                    <span className="text-slate-500">p5: <span className="text-slate-300">{v.p5}</span></span>
                                    <span className="text-slate-500">p95: <span className="text-slate-300">{v.p95}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'api' && (
                    <div className="space-y-5">
                        <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Your API Token</p>
                            <div className="bg-black/60 border border-indigo-900/40 rounded-lg px-4 py-3 font-mono text-xs text-indigo-300 break-all">{apiToken}</div>
                            <p className="text-[10px] text-slate-600 mt-1">Rate limited to 1,000 queries/hour per institution credential.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Example Queries</p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Get JSON data within spatial bounds + time window', cmd: `curl -H "Authorization: ${apiToken.slice(0, 28)}..." \\\n  "https://api.farmsense.io/research/datasets/DS-2024-001/download?\n   bbox=-106.5,37.2,-105.8,37.8\n   &start=2024-06-01&end=2024-08-31\n   &format=json"` },
                                    { label: 'Download NetCDF-4 for offline analysis', cmd: `curl -H "Authorization: ${apiToken.slice(0, 28)}..." \\\n  -o field_data.nc4 \\\n  "https://api.farmsense.io/research/datasets/DS-2024-001/download?format=netcdf4"` },
                                ].map(ex => (
                                    <div key={ex.label} className="bg-black/60 border border-purple-900/30 rounded-xl p-4">
                                        <p className="text-[10px] text-slate-500 mb-2">{ex.label}</p>
                                        <pre className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap">{ex.cmd}</pre>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'citations' && (
                    <div className="space-y-4">
                        {MOCK_DATASETS.map(ds => (
                            <div key={ds.id} className="bg-black/40 border border-purple-900/30 rounded-xl p-4 space-y-3">
                                <p className="text-xs font-bold text-white">{ds.name}</p>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">APA</p>
                                        <p className="text-[10px] font-mono text-slate-400 italic">FarmSense Research Consortium. (2024). <em>{ds.name}</em> ({ds.version}). FarmSense Open Data. https://doi.org/{ds.doi}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">BibTeX</p>
                                        <pre className="text-[9px] font-mono text-slate-500 bg-black/30 rounded p-2">{`@dataset{farmsense_${ds.id.replace(/-/g, '_')},\n  title={{${ds.name}}},\n  author={FarmSense Research Consortium},\n  year={2024},\n  version={${ds.version}},\n  doi={${ds.doi}}\n}`}</pre>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                        <Quote className="w-3 h-3 text-purple-500" />
                                        <span>DOI: <span className="font-mono text-indigo-400">{ds.doi}</span></span>
                                        <span className="text-slate-600">·</span>
                                        <span>Cited by: <span className="font-bold text-white">{Math.floor(Math.random() * 14 + 2)}</span> papers</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpenDataRepository;
