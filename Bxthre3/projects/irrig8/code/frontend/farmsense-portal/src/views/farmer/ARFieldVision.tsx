import { useState, useEffect } from 'react';
import { Target, Droplets, Zap, Cpu } from 'lucide-react';

export const ARFieldVision = () => {
    const [scanPosition, setScanPosition] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setScanPosition((prev) => (prev >= 100 ? 0 : prev + 1));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 bg-slate-950 overflow-hidden font-mono">
            {/* Simulated real-world camera feed backdrop */}
            <div
                className="absolute inset-0 opacity-40 mix-blend-luminosity"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #064e3b 0%, #020617 100%)',
                    backgroundSize: 'cover'
                }}
            ></div>

            {/* AR Grid & Scanlines */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    transform: 'perspective(1000px) rotateX(60deg) scale(2) translateY(-100px)'
                }}
            ></div>

            {/* Active Scanning Line */}
            <div
                className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,1)] opacity-70"
                style={{ top: `${scanPosition}%` }}
            ></div>

            {/* HUD Info Panels */}
            <div className="absolute top-6 left-6 flex flex-col gap-4">
                <div className="bg-emerald-950/80 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-md shadow-lg shadow-emerald-500/10">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                        <Cpu className="w-5 h-5 animate-pulse" />
                        <span>SilasHUD ACTIVE</span>
                    </div>
                    <p className="text-xs text-emerald-500/70 tracking-widest">OPTICAL OVERLAY SECURE</p>
                    <p className="text-xs text-emerald-500/70 tracking-widest mt-1">LAT: 40.4173° N | LON: 82.9071° W</p>
                </div>
            </div>

            <div className="absolute top-6 right-6 flex flex-col gap-4 items-end">
                <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-md">
                    <div className="text-right">
                        <p className="text-xs text-slate-400 tracking-widest">FIELD SPECTRAL ANALYSIS</p>
                        <p className="text-2xl font-black text-emerald-400 tracking-tighter mt-1">98.2%</p>
                        <p className="text-xs text-emerald-500 font-bold mt-1">CROP VITALITY</p>
                    </div>
                </div>
            </div>

            {/* 3D Floating Anchored Metrics */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Node 1 - Soil Moisture Array */}
                <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-crosshair">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/50 flex items-center justify-center animate-spin-slow">
                            <Target className="w-8 h-8 text-emerald-400/50" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)]"></div>

                        {/* Popout Info Board */}
                        <div className="absolute left-full top-0 ml-8 w-48 bg-slate-900/90 border border-emerald-500/40 p-3 rounded-lg backdrop-blur-md transform transition-all group-hover:scale-110 origin-left">
                            <div className="flex items-center gap-2 mb-2">
                                <Droplets className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs font-bold text-white tracking-widest">NODE Alpha-1</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Moisture</span>
                                    <span className="text-cyan-400 font-bold">42.5%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Temp</span>
                                    <span className="text-white">18.2°C</span>
                                </div>
                            </div>
                            <div className="h-[1px] w-full bg-emerald-500/20 my-2"></div>
                            <div className="text-[10px] text-emerald-500 tracking-widest font-bold flex justify-between">
                                STATUS: <span className="text-emerald-400">OPTIMAL</span>
                            </div>
                        </div>

                        {/* Connector Line */}
                        <div className="absolute top-1/2 left-full w-8 h-[1px] bg-emerald-500/40 border-dashed"></div>
                    </div>
                </div>

                {/* Node 2 - Nutrient Saturation */}
                <div className="absolute top-[60%] left-[65%] -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-crosshair">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border border-orange-500/30 flex items-center justify-center animate-[spin_8s_linear_infinite_reverse]">
                            <Target className="w-10 h-10 text-orange-400/30" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-400 rounded-full shadow-[0_0_15px_rgba(249,115,22,1)] animate-pulse"></div>

                        {/* Popout Info Board */}
                        <div className="absolute left-full top-0 ml-10 w-56 bg-slate-900/90 border border-orange-500/40 p-3 rounded-lg backdrop-blur-md transform transition-all group-hover:scale-110 origin-left">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-orange-400" />
                                <span className="text-xs font-bold text-white tracking-widest">NODE Beta-4</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Nitrogen</span>
                                    <span className="text-orange-400 font-bold -mt-0.5 animate-pulse flex items-center gap-1"><Zap className="w-3 h-3" /> LOW</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Phosphorus</span>
                                    <span className="text-white">Optimum</span>
                                </div>
                            </div>
                            <div className="h-[1px] w-full bg-orange-500/20 my-2"></div>
                            <div className="text-[10px] text-orange-500 tracking-widest font-bold flex justify-between">
                                ACTION: <button className="bg-orange-500 text-slate-950 px-2 py-0.5 rounded shadow-sm hover:bg-orange-400 transition-colors">INITIATE DOSE</button>
                            </div>
                        </div>

                        {/* Connector Line */}
                        <div className="absolute top-1/2 left-full w-10 h-[1px] bg-orange-500/40 border-dashed"></div>
                    </div>
                </div>
            </div>

            {/* Bottom Crosshair / Tooltip */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <Target className="w-8 h-8 text-emerald-500/30 mb-2" />
                <p className="text-xs text-emerald-500/50 uppercase tracking-widest">Silas Vision AR Field Mode Active</p>
            </div>
        </div>
    );
};
