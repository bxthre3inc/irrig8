import React, { useState, useEffect } from 'react';
import { ClipboardList, ShieldCheck, TrendingUp, Video, AlertTriangle } from 'lucide-react';
import { ComplianceList } from '../regulatory/ComplianceList';
import { IntegrityChainVisualizer } from '../regulatory/IntegrityChainVisualizer';
import { ScientificValidation } from '../regulatory/ScientificValidation';
import { DroneARFeed } from '../regulatory/DroneARFeed';
import { EconomicImpact } from '../regulatory/EconomicImpact';
import { api } from '../../services/api';

export const ComplianceDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState<'reports' | 'science' | 'economy' | 'drone'>('reports');
    const [metrics, setMetrics] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [stats, setStats] = useState({
        overallScore: 0,
        activeAlerts: 0,
        pendingAudits: 0,
        verifiedFields: 0
    });

    const fetchComplianceData = React.useCallback(async () => {
        setLoading(true);
        try {
            const latest = await api.compliance.getLatestGAPReport('FIELD-001') as any;
            if (latest && latest.overall_score !== undefined) {
                setReports([latest]);
                setStats({
                    overallScore: Math.round(latest.overall_score * 100),
                    activeAlerts: (latest.control_points || []).filter((cp: any) => cp.level !== 'pass').length,
                    pendingAudits: 0,
                    verifiedFields: 1
                });
            }
        } catch (err) {
            console.error('Failed to fetch compliance data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleGenerateReport = async () => {
        setGenerating(true);
        try {
            const newReport = await api.compliance.generateGAPReport({
                field_id: 'FIELD-001',
                field_name: 'NE Quarter - SLV',
                farm_name: 'San Luis Valley Operations',
                grower_id: 'GROW-772'
            }) as any;
            setReports(prev => [newReport, ...prev]);
        } catch (err) {
            console.error('Failed to generate report:', err);
        } finally {
            setGenerating(false);
        }
    };

    const fetchMetrics = React.useCallback(async () => {
        try {
            const data = await api.admin.getMetrics();
            setMetrics(data);
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        }
    }, []);

    useEffect(() => {
        fetchMetrics();
        fetchComplianceData();
    }, [fetchMetrics, fetchComplianceData]);

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white">
            {/* Sub-header Navigation */}
            <div className="bg-slate-900 border-b border-white/5 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8 h-12">
                        <button
                            onClick={() => setActiveView('reports')}
                            className={`flex items-center gap-2 px-1 border-b-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeView === 'reports' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            <ClipboardList className="w-4 h-4" /> Compliance Reports
                        </button>
                        <button
                            onClick={() => setActiveView('science')}
                            className={`flex items-center gap-2 px-1 border-b-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeView === 'science' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-600 hover:text-slate-300'}`}
                        >
                            <ShieldCheck className="w-4 h-4" /> Scientific Validation
                        </button>
                        <button
                            onClick={() => setActiveView('economy')}
                            className={`flex items-center gap-2 px-1 border-b-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeView === 'economy' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-600 hover:text-slate-300'}`}
                        >
                            <TrendingUp className="w-4 h-4" /> Economic Impact & IP
                        </button>
                        <button
                            onClick={() => setActiveView('drone')}
                            className={`flex items-center gap-2 px-1 border-b-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeView === 'drone' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-600 hover:text-slate-300'}`}
                        >
                            <Video className="w-4 h-4" /> Drone AR Feed
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 overflow-y-auto">

                {/* Automated Anomaly Detection Alert */}
                <div className="bg-red-950/30 border border-red-500/50 p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-1">Automated Anomaly Detected: Zone 4B</h4>
                        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">Cryptographic hash mismatch identified in manual water log entry #8492. Flow meter telemetry reports 0 gallons pumped, but multi-spectral satellite moisture index jumped by 22% in a 4-hour window.</p>
                        <button className="mt-3 text-[10px] bg-red-500 text-white font-bold uppercase tracking-widest px-4 py-2 hover:bg-red-400 transition-colors rounded">Issue State Citation</button>
                    </div>
                </div>

                <IntegrityChainVisualizer />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[#0A1120] border border-blue-900/30 p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors rounded-xl">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Compliance Rate</p>
                        <p className="text-4xl font-black text-white mt-3 font-mono">{metrics ? metrics.compliance_rate_pct + '%' : '98.4%'}</p>
                    </div>
                    <div className="bg-red-950/20 border border-red-900/50 p-6 relative overflow-hidden group hover:border-red-500/50 transition-colors rounded-xl">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 blur-2xl group-hover:bg-red-500/20 transition-all"></div>
                        <p className="text-[10px] text-red-500/70 font-bold uppercase tracking-widest">Critical Violations</p>
                        <p className="text-4xl font-black text-red-500 mt-3 font-mono">{metrics ? metrics.critical_violations : '2'}</p>
                    </div>
                    <div className="bg-[#0A1120] border border-blue-900/30 p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors rounded-xl">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Audits This Month</p>
                        <p className="text-4xl font-black text-white mt-3 font-mono">{metrics ? metrics.audits_this_month : '14'}</p>
                    </div>
                    <div className="bg-[#0A1120] border border-blue-900/30 p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors rounded-xl">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fields Monitored</p>
                        <p className="text-4xl font-black text-white mt-3 font-mono">{metrics ? metrics.total_fields_monitored : '842'}</p>
                    </div>
                </div>

                {activeView === 'reports' ? (
                    <ComplianceList reports={reports} loading={loading} stats={stats} onGenerateReport={handleGenerateReport} generating={generating} />
                ) : activeView === 'science' ? (
                    <ScientificValidation />
                ) : activeView === 'drone' ? (
                    <DroneARFeed />
                ) : (
                    <EconomicImpact />
                )}
            </main>
        </div>
    );
};

export default ComplianceDashboard;
