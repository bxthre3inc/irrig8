import React, { useState } from 'react';
import { Activity, Droplets, Map, AlertTriangle, Play, Pause } from 'lucide-react';

interface FleetPivot {
    id: string;
    field_name: string;
    status: 'ACTIVE' | 'IDLE' | 'THROTTLED' | 'OFF';
    last_sync: string;
    moisture_status: number;
    daily_usage: number;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const SLVFleetDashboard: React.FC = () => {
    const [isAutonomous, setIsAutonomous] = useState(false);

    const pivots: FleetPivot[] = [
        { id: 'PVT-001', field_name: 'North Quarter - SLV', status: 'ACTIVE', last_sync: '10:45 AM', moisture_status: 28, daily_usage: 450000, urgency: 'HIGH' },
        { id: 'PVT-002', field_name: 'East Mesa Circle', status: 'IDLE', last_sync: '11:12 AM', moisture_status: 34, daily_usage: 120000, urgency: 'LOW' },
        { id: 'PVT-003', field_name: 'South Valley Pivot', status: 'THROTTLED', last_sync: '11:05 AM', moisture_status: 22, daily_usage: 680000, urgency: 'MEDIUM' },
        { id: 'PVT-004', field_name: 'West Ridge Alfalfa', status: 'OFF', last_sync: '09:30 AM', moisture_status: 31, daily_usage: 0, urgency: 'LOW' },
    ];

    const quotaTotal = 1500000;
    const currentUsage = pivots.reduce((acc, p) => acc + p.daily_usage, 0);
    const usagePct = (currentUsage / quotaTotal) * 100;

    return (
        <div className="bg-[#0a0c14] min-h-screen p-8 text-slate-300 font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Map className="text-blue-500 w-8 h-8" />
                        San Luis Valley (SLV) Fleet Manager
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-mono">Autonomous Irrigation Management (AIM) v2.0</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Regional Quota Utilization</span>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="w-48 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500" style={{ width: `${usagePct}%` }} />
                            </div>
                            <span className="text-xs font-mono font-bold text-blue-400">{usagePct.toFixed(1)}%</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAutonomous(!isAutonomous)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-all border ${isAutonomous ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                    >
                        {isAutonomous ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        AUTONOMOUS MODE: {isAutonomous ? 'ACTIVE' : 'STANDBY'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fleet Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#111420] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                            <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Total Daily Consumption</h3>
                            <p className="text-3xl font-mono font-bold text-white">{currentUsage.toLocaleString()} <span className="text-sm text-slate-500">GAL</span></p>
                        </div>
                        <div className="bg-[#111420] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                            <Droplets className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors" />
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Predicted 14-Day Savings</h3>
                            <p className="text-3xl font-mono font-bold text-emerald-400">+12.4 <span className="text-sm text-slate-500">%</span></p>
                        </div>
                    </div>

                    <div className="bg-[#111420] border border-slate-800 rounded-2xl overflow-hidden text-sm">
                        <table className="w-full text-left">
                            <thead className="bg-[#161b2b] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Pivot ID</th>
                                    <th className="px-6 py-4">Field Location</th>
                                    <th className="px-6 py-4">Moisture</th>
                                    <th className="px-6 py-4">Usage (GAL)</th>
                                    <th className="px-6 py-4 text-center">Action Urgency</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {pivots.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-xs font-bold text-blue-400">{p.id}</td>
                                        <td className="px-6 py-5 text-white font-medium">{p.field_name}</td>
                                        <td className="px-6 py-5 font-mono text-slate-400">{p.moisture_status}%</td>
                                        <td className="px-6 py-5 font-mono">{p.daily_usage.toLocaleString()}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-bold border ${p.urgency === 'HIGH' ? 'bg-red-500/10 border-red-500/40 text-red-500' : p.urgency === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                                    {p.urgency}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Alerts */}
                <div className="space-y-6">
                    <div className="bg-[#111420] border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Anomaly Detection
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                                <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Potential Drift Detected</p>
                                <p className="text-xs text-slate-400">Sensor VFA-X9 (PVT-003) reporting moisture 40% below MSF predicted trend line.</p>
                                <div className="mt-2 flex gap-2">
                                    <button className="text-[9px] font-bold text-red-400 underline uppercase">Down-weight Sensor</button>
                                    <button className="text-[9px] font-bold text-slate-500 underline uppercase">Ignore</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-900/30 p-6 rounded-2xl">
                        <h3 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">14-Day Outlook Summary</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Cumulative SLV moisture levels are projected to drop 8.4% without fleet intervention. Quota availability is HIGH (640k gal remaining).
                        </p>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-colors">
                            DOWNLOAD FLEET REPORT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
