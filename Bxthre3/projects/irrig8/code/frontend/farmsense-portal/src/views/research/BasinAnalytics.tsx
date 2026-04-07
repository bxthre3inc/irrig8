import React, { useState } from 'react';
import { Globe, TrendingUp, Leaf, Map, GitCompare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

type Tab = 'extraction' | 'et' | 'crops' | 'coverage' | 'crossbasin';

function mockExtractionData() {
    return Array.from({ length: 24 }, (_, i) => {
        const month = new Date(2023, i % 12).toLocaleString('default', { month: 'short' });
        const year = 2023 + Math.floor(i / 12);
        const seasonal = Math.sin((i % 12 - 4) / 12 * Math.PI * 2) * 400;
        const trend = -i * 3;
        return {
            label: `${month} ${year}`,
            extraction: Math.max(200, Math.round(1800 + seasonal + trend + (Math.random() - 0.5) * 80)),
            permitted: 2200,
        };
    });
}

function mockETvsPrecip() {
    return Array.from({ length: 24 }, (_, i) => {
        const month = new Date(2023, i % 12).toLocaleString('default', { month: 'short' });
        const year = 2023 + Math.floor(i / 12);
        const etSeasonal = Math.max(1, Math.sin((i % 12 - 3) / 12 * Math.PI * 2) * 7 + 6);
        const precip = Math.max(0, Math.cos((i % 12 - 7) / 12 * Math.PI * 2) * 30 + 15 + (Math.random() - 0.5) * 10);
        return { label: `${month} ${year}`, et: parseFloat(etSeasonal.toFixed(2)), precip: parseFloat(precip.toFixed(1)) };
    });
}

function mockCropNDVI() {
    const crops = [
        { name: 'Alfalfa', phase: 0, color: '#4ade80' },
        { name: 'Corn', phase: 2, color: '#facc15' },
        { name: 'Wheat', phase: 4, color: '#fb923c' },
    ];
    return Array.from({ length: 12 }, (_, i) => {
        const entry: Record<string, any> = { month: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i] };
        crops.forEach(c => {
            entry[c.name] = parseFloat((0.3 + Math.max(0, Math.sin((i - c.phase) / 12 * Math.PI * 2)) * 0.5 + Math.random() * 0.03).toFixed(3));
        });
        return entry;
    });
}

const MOCK_COVERAGE = [
    { Zone: 'Center, CO (Subdistrict 1)', density: 'High', nodes: 142, uncertainty: 'Low' },
    { Zone: 'Monte Vista, CO', density: 'Medium', nodes: 67, uncertainty: 'Moderate' },
    { Zone: 'Alamosa, CO', density: 'Medium', nodes: 81, uncertainty: 'Moderate' },
    { Zone: 'Saguache, CO', density: 'Low', nodes: 14, uncertainty: 'High' },
    { Zone: 'Blanca, CO', density: 'Sparse', nodes: 4, uncertainty: 'Very High' },
];

const densityColor: Record<string, string> = { High: 'text-emerald-400', Medium: 'text-amber-400', Low: 'text-orange-400', Sparse: 'text-red-400' };
const unCertaintyBg: Record<string, string> = { Low: 'bg-emerald-900/20 border-emerald-900/40 text-emerald-400', Moderate: 'bg-amber-900/20 border-amber-800/40 text-amber-400', High: 'bg-orange-900/20 border-orange-800/40 text-orange-400', 'Very High': 'bg-red-900/20 border-red-800/40 text-red-400' };

export const BasinAnalytics: React.FC = () => {
    const [tab, setTab] = useState<Tab>('extraction');
    const extractionData = mockExtractionData();
    const etData = mockETvsPrecip();
    const cropData = mockCropNDVI();

    return (
        <div className="bg-[#070511] rounded-xl border border-purple-900/30 overflow-hidden flex flex-col min-h-[680px]">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-900/30 bg-black/30">
                <div className="bg-teal-600/20 p-2 rounded-lg"><Globe className="w-5 h-5 text-teal-400" /></div>
                <div>
                    <h2 className="font-bold text-white text-sm tracking-wide">Anonymized Basin Analytics</h2>
                    <p className="text-[10px] text-teal-500 font-mono uppercase tracking-widest">Research-grade aggregated basin statistics</p>
                </div>
            </div>

            <div className="flex border-b border-purple-900/20 bg-black/20 px-6 overflow-x-auto">
                {([['extraction', 'Extraction', TrendingUp], ['et', 'ET vs Precip', Globe], ['crops', 'Crop Health', Leaf], ['coverage', 'Coverage', Map], ['crossbasin', 'Cross-Basin', GitCompare]] as [Tab, string, any][]).map(([id, label, Icon]) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`py-3 px-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${tab === id ? 'border-teal-500 text-teal-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                        <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {tab === 'extraction' && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-3 gap-3">
                            {[{ label: 'Total Extracted (Last 12mo)', value: '18,421', unit: 'ac-ft' }, { label: 'YoY Change', value: '-6.2%', unit: '↓ trend' }, { label: 'vs. Permitted Avg', value: '82%', unit: 'utilization' }].map(m => (
                                <div key={m.label} className="bg-black/40 border border-teal-900/30 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black font-mono text-teal-400">{m.value}</p>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">{m.label}</p>
                                    <p className="text-[9px] text-teal-700 font-mono">{m.unit}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-black/40 border border-purple-900/30 rounded-xl p-5 h-64">
                            <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-3">Basin Groundwater Extraction — 24 Month</p>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={extractionData}>
                                    <defs>
                                        <linearGradient id="exGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
                                    <XAxis dataKey="label" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 9 }} interval={3} />
                                    <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 9 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#070511', borderColor: '#134e4a', borderRadius: '8px', color: '#fff', fontSize: 11 }} />
                                    <Area type="monotone" dataKey="extraction" stroke="#2dd4bf" fill="url(#exGrad)" strokeWidth={2} name="Extracted (ac-ft/mo)" />
                                    <Line type="monotone" dataKey="permitted" stroke="#475569" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Permitted Avg" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {tab === 'et' && (
                    <div className="space-y-5">
                        <div className="bg-black/40 border border-purple-900/30 rounded-xl p-5 h-72">
                            <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-3">ET Demand vs. Precipitation — 24 Month</p>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={etData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
                                    <XAxis dataKey="label" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 9 }} interval={3} />
                                    <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 9 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#070511', borderColor: '#134e4a', borderRadius: '8px', color: '#fff', fontSize: 11 }} />
                                    <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
                                    <Line type="monotone" dataKey="et" stroke="#f97316" strokeWidth={2} dot={false} name="ET Demand (mm/day)" />
                                    <Line type="monotone" dataKey="precip" stroke="#38bdf8" strokeWidth={2} dot={false} name="Precipitation (mm/mo÷30)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-4 text-sm text-slate-300">
                            The gap between ET demand and precipitation is the <span className="text-white font-bold">irrigation necessity signal</span> — demonstrating structural groundwater dependence through dry months.
                        </div>
                    </div>
                )}

                {tab === 'crops' && (
                    <div className="space-y-5">
                        <div className="bg-black/40 border border-purple-900/30 rounded-xl p-5 h-72">
                            <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-3">NDVI Time Series by Crop Type — 2024</p>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={cropData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
                                    <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                    <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} domain={[0, 1]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#070511', borderColor: '#134e4a', borderRadius: '8px', color: '#fff', fontSize: 11 }} />
                                    <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
                                    <Line type="monotone" dataKey="Alfalfa" stroke="#4ade80" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Corn" stroke="#facc15" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Wheat" stroke="#fb923c" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {tab === 'coverage' && (
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Sensor Network Coverage Map — SLV Basin</p>
                        <div className="space-y-2">
                            {MOCK_COVERAGE.map(Zone => (
                                <div key={Zone.Zone} className="flex items-center gap-4 bg-black/40 border border-purple-900/20 rounded-xl px-4 py-3">
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-300 font-medium">{Zone.Zone}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${densityColor[Zone.density]}`}>{Zone.density} density — {Zone.nodes} nodes</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${unCertaintyBg[Zone.uncertainty]}`}>
                                        {Zone.uncertainty} uncertainty
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4 text-xs text-amber-300">
                            ⚠ Saguache and Blanca Zones have insufficient sensor density. Additional VFA/LRZ deployments recommended before relying on Kriging interpolations in these areas.
                        </div>
                    </div>
                )}

                {tab === 'crossbasin' && (
                    <div className="space-y-5">
                        <p className="text-[10px] text-slate-500">Overlay extraction and crop health metrics across monitored basins for comparative aquifer hydrology.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[{ basin: 'SLV Basin, CO', trend: '−6.2% YoY', health: '0.64 NDVI avg', color: '#2dd4bf' }, { basin: 'Platte Basin, NE (Projected)', trend: '−2.1% YoY', health: '0.71 NDVI avg', color: '#818cf8' }].map(b => (
                                <div key={b.basin} className="bg-black/40 border border-purple-900/30 rounded-xl p-4">
                                    <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: b.color }} />
                                    <p className="text-xs font-bold text-white">{b.basin}</p>
                                    <p className="text-[10px] text-slate-400 mt-2">Extraction trend: <span className="text-red-400 font-mono">{b.trend}</span></p>
                                    <p className="text-[10px] text-slate-400">Crop health: <span className="font-mono" style={{ color: b.color }}>{b.health}</span></p>
                                </div>
                            ))}
                        </div>
                        <div className="border border-dashed border-purple-900/30 rounded-xl h-28 flex items-center justify-center text-slate-600 text-xs">
                            Multi-basin overlay chart — connects to additional basin API endpoints
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BasinAnalytics;
