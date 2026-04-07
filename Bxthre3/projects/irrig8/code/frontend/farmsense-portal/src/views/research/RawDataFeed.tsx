import React, { useState, useEffect } from 'react';
import { Sliders, Microscope, Database, RefreshCw, Download } from 'lucide-react';
import { MatrixDataStream } from '../research/MatrixDataStream';
import { ParameterDial } from '../research/ParameterDial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';

const mockChartData = [
    { name: 'Jan', nutrientA: 4000, nutrientB: 2400 },
    { name: 'Feb', nutrientA: 3000, nutrientB: 1398 },
    { name: 'Mar', nutrientA: 2000, nutrientB: 9800 },
    { name: 'Apr', nutrientA: 2780, nutrientB: 3908 },
    { name: 'May', nutrientA: 1890, nutrientB: 4800 },
    { name: 'Jun', nutrientA: 2390, nutrientB: 3800 },
    { name: 'Jul', nutrientA: 3490, nutrientB: 4300 },
];

interface Dataset {
    id: string;
    name: string;
    type: string;
    size_mb: number;
}

export const RawDataFeed: React.FC = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [dials, setDials] = useState({ depth: 15, moisture: 45, ph: 6 });

    const fetchDatasets = async () => {
        setLoading(true);
        try {
            const data = await api.research.getLabData();
            setDatasets(data as Dataset[]);
        } catch {
            // fallback
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatasets();
    }, []);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => setIsExporting(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Raw Telemetry & Matrix Stream</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Direct sensor ingestion pipeline and real-time Kriging pre-processing</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:from-emerald-500 hover:to-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                        <Download className="w-3.5 h-3.5" /> Export All
                    </button>
                </div>
            </div>

            <MatrixDataStream isStreaming={isExporting} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                <div className="lg:col-span-1">
                    <div className="bg-[#0A0713] p-5 rounded-xl shadow-lg border border-purple-900/30">
                        <div className="flex items-center gap-2 mb-5 text-purple-400 border-b border-purple-900/50 pb-3">
                            <Sliders className="w-4 h-4" />
                            <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Query Parameters</h3>
                        </div>
                        <div className="flex flex-col gap-8 py-2">
                            <ParameterDial label="Depth Range" value={dials.depth} min={0} max={50} unit="cm" onChange={v => setDials(d => ({ ...d, depth: v }))} />
                            <ParameterDial label="Moisture Idx" value={dials.moisture} min={0} max={100} unit="%" onChange={v => setDials(d => ({ ...d, moisture: v }))} />
                            <ParameterDial label="Base pH" value={dials.ph} min={3} max={10} unit="lvl" onChange={v => setDials(d => ({ ...d, ph: v }))} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-[#0A0713] p-5 rounded-xl shadow-lg border border-purple-900/30 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
                            <h3 className="text-xs font-mono font-bold text-purple-400 mb-5 uppercase tracking-widest flex items-center gap-2">
                                <Microscope className="w-4 h-4" /> Soil Nutrient Trends
                            </h3>
                            <div className="h-72 w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2D1B4E" vertical={false} />
                                        <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                        <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0A0713', borderColor: '#3b0764', color: '#e9d5ff', borderRadius: '8px' }} itemStyle={{ color: '#d8b4fe' }} />
                                        <Legend wrapperStyle={{ paddingTop: '16px' }} />
                                        <Line type="monotone" dataKey="nutrientA" stroke="#a855f7" strokeWidth={3} dot={false} />
                                        <Line type="monotone" dataKey="nutrientB" stroke="#3b82f6" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-[#0A0713] p-5 rounded-xl shadow-lg border border-purple-900/30">
                            <div className="flex justify-between items-center mb-5 pb-3 border-b border-purple-900/50">
                                <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2"><Database className="w-4 h-4" /> Datasets</h3>
                                <button onClick={fetchDatasets} className="text-purple-500 hover:text-purple-300 transition-colors">
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {datasets.map(ds => (
                                    <li key={ds.id} className="flex items-center justify-between p-2.5 bg-black/40 rounded-lg border border-purple-900/30 hover:border-purple-500/40 transition-all group cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Database className={`w-3.5 h-3.5 ${ds.type === 'satellite' ? 'text-blue-500' : 'text-purple-500'}`} />
                                            <div>
                                                <span className="text-xs font-medium text-slate-300 block">{ds.name}</span>
                                                <span className="text-[9px] text-slate-500 font-mono uppercase">{ds.type} · {ds.size_mb}MB</span>
                                            </div>
                                        </div>
                                        <Download className="w-3.5 h-3.5 text-purple-800 group-hover:text-purple-400 transition-colors" />
                                    </li>
                                ))}
                                {!loading && datasets.length === 0 && (
                                    <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest text-center py-6 border border-dashed border-purple-900/30 rounded-lg">No datasets available.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
