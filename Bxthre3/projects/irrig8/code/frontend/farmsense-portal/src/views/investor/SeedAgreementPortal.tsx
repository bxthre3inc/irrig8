import { Shield, BarChart3, Globe, X } from 'lucide-react';

interface SeedAgreementPortalProps {
    shares?: number;
    price?: number;
    onSigned?: () => void;
    onCancel?: () => void;
}

export const SeedAgreementPortal: React.FC<SeedAgreementPortalProps> = ({ 
    shares = 0, 
    price = 0, 
    onSigned, 
    onCancel 
}) => {
    return (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl p-8 overflow-auto">
            <div className="max-w-6xl mx-auto space-y-8 relative">
                <button 
                    onClick={onCancel}
                    className="absolute -top-4 -right-4 p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-all z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tight">Seed Round A-1 Agreement</h2>
                        <p className="text-slate-400 font-medium">Digital instrument for strategic capital allocation.</p>
                        {shares > 0 && (
                            <div className="mt-4 inline-flex items-center gap-4 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Execution Target:</span>
                                <span className="text-white font-black">{shares.toLocaleString()} Shares @ ${price.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={onCancel}
                            className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold rounded-xl transition-all"
                        >
                            Decline
                        </button>
                        <button 
                            onClick={onSigned}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-900/20"
                        >
                            Authorize & Execute
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 font-serif text-slate-300 leading-relaxed shadow-2xl">
                            <section className="space-y-4">
                                <h3 className="text-white font-black text-xl tracking-wide uppercase border-b border-white/5 pb-4 font-sans">1. Allocation Summary</h3>
                                <p>This document outlines the participation terms for the FarmSense (FS-1) Seed A-1 round. 
                                   The deterministic telemetry infrastructure developed by FarmSense represents a paradigm shift in climate-resilient agriculture.</p>
                            </section>

                            <section className="space-y-4 pt-6">
                                <h3 className="text-white font-black text-xl tracking-wide uppercase border-b border-white/5 pb-4 font-sans">2. Deterministic Rights</h3>
                                <p>Investors participating at the $1M+ Tier acquire direct node-governance rights and real-time access to the 0.7cm orthomosaic audit chain.</p>
                            </section>

                            <div className="p-12 border-4 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600 font-sans">
                                <Shield className="w-16 h-16 mb-4 opacity-20" />
                                <p className="font-bold">Authorized Signature Required</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-2xl">
                            <BarChart3 className="w-8 h-8 text-indigo-400 mb-6" />
                            <h4 className="text-white font-black mb-1 uppercase tracking-widest text-sm">Round Participation</h4>
                            <p className="text-indigo-200 text-3xl font-black">$4.2M / $10M</p>
                            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                                <div className="bg-indigo-500 h-full w-[42%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h4 className="text-white font-black mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
                                <Globe className="w-4 h-4 text-cyan-400" /> Recent Commitments
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { name: 'TerraCap Ventures', amount: '$500k', time: '2h ago' },
                                    { name: 'AgriNext Equity', amount: '$1.2M', time: '6h ago' }
                                ].map((c, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="text-sm font-bold text-white">{c.name}</p>
                                            <p className="text-[10px] text-slate-500">{c.time}</p>
                                        </div>
                                        <div className="text-indigo-400 font-black">{c.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
