import { useState, useEffect } from 'react';
import { ShieldCheck, Users, Lock, ChevronRight, Building2, Zap, CheckCircle2, Globe } from 'lucide-react';

interface PublicLetter {
    id: string;
    organization: string;
    description: string;
    date: string;
}

interface InvestorLandingProps {
    onExplore?: () => void;
}

export const InvestorLanding: React.FC<InvestorLandingProps> = ({ onExplore }) => {
    const [letters, setLetters] = useState<PublicLetter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking public support letters list
        const mockLetters: PublicLetter[] = [
            { id: '1', organization: 'CSU SLV Research Center', description: 'Deterministic sensor validation for sub-surface moisture monitoring.', date: '2024-03-15' },
            { id: '2', organization: 'Rio Grande Water Conservation District', description: 'Institutional support for precision water management platform.', date: '2024-03-12' },
            { id: '3', organization: 'Valley Green Co-op', description: 'Strategic partnership for nutrient optimization pilots.', date: '2024-03-10' }
        ];
        
        setTimeout(() => {
            setLetters(mockLetters);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-20 pb-32">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#064e3b_0%,_#020617_60%)] opacity-40"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <ShieldCheck className="w-4 h-4" /> Strategic capital Portal
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
                            INVEST IN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">DETERMINISTIC</span> FUTURE.
                        </h1>
                        <p className="text-xl text-slate-400 font-medium mb-10 max-w-2xl leading-relaxed">
                            FarmSense (FS-1) is the first operating system designed to eliminate agricultural uncertainty. 
                            Our infrastructure layers provide real-time, ground-truth verification for every drop of water and unit of nutrient.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={onExplore}
                                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2"
                            >
                                Access Data Room <ChevronRight className="w-5 h-5" />
                            </button>
                            <button className="px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl transition-all">
                                Executive Summary
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Network Nodes', val: '12,409', icon: Globe, color: 'text-emerald-400' },
                        { label: 'System Uptime', val: '99.99%', icon: Zap, color: 'text-cyan-400' },
                        { label: 'Authorized Cap', val: '$45M+', icon: Building2, color: 'text-indigo-400' },
                        { label: 'Stakeholders', val: '842', icon: Users, color: 'text-emerald-400' }
                    ].map((m, i) => (
                        <div key={i} className="bg-slate-900/80 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                            <m.icon className={`w-6 h-6 ${m.color} mb-4`} />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                            <p className="text-3xl font-black text-white">{m.val}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support Letters Section */}
            <div className="max-w-7xl mx-auto px-6 py-32">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-4">Letters of Institutional Support</h2>
                        <p className="text-slate-400 max-w-xl">Public attestations from research centers, conservation districts, and agricultural co-ops validating the FS-1 platform.</p>
                    </div>
                    <button className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-900/40 animate-pulse rounded-2xl border border-white/5"></div>
                        ))
                    ) : (
                        letters.map((l) => (
                            <div key={l.id} className="group bg-slate-900/60 border border-white/5 p-8 rounded-2xl hover:bg-slate-900 transition-all hover:border-emerald-500/30 flex flex-col justify-between h-64">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500">{l.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{l.organization}</h3>
                                    <p className="text-sm text-slate-400 italic line-clamp-3">"{l.description}"</p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500 tracking-widest pt-4 border-t border-white/5">
                                    <Lock className="w-3 h-3" /> Immutable Attestation
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
