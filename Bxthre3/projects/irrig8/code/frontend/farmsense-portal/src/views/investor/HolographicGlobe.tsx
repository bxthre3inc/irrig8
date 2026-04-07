import { Globe, Activity, Network as NetworkIcon } from 'lucide-react';

export const HolographicGlobe = () => {
    return (
        <div className="relative w-full h-[600px] bg-slate-950 flex justify-center items-center overflow-hidden font-mono rounded-xl border border-slate-800">

            {/* Background Starfield / Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]"></div>

            {/* Central Hologram Projection Base */}
            <div className="absolute bottom-10 w-64 h-8 bg-blue-500/20 rounded-[100%] blur-xl animate-pulse"></div>
            <div className="absolute bottom-12 w-32 h-4 bg-cyan-400/40 rounded-[100%] blur-md"></div>

            {/* The Globe Wrapper */}
            <div className="relative w-96 h-96 animate-[spin_60s_linear_infinite] [transform-style:preserve-3d]">

                {/* Wireframe Sphere */}
                <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full shadow-[0_0_50px_rgba(6,182,212,0.2)_inset]">
                    {/* Lat/Long Lines */}
                    <div className="absolute inset-0 border border-cyan-500/20 rounded-full [transform:rotateX(75deg)]"></div>
                    <div className="absolute inset-0 border border-cyan-500/20 rounded-full [transform:rotateX(75deg)_rotateY(45deg)]"></div>
                    <div className="absolute inset-0 border border-cyan-500/20 rounded-full [transform:rotateX(75deg)_rotateY(90deg)]"></div>
                    <div className="absolute inset-0 border border-cyan-500/20 rounded-full [transform:rotateX(75deg)_rotateY(135deg)]"></div>

                    <div className="absolute top-1/4 bottom-1/4 left-0 right-0 border border-cyan-500/20 rounded-[100%]"></div>
                    <div className="absolute top-0 bottom-0 left-1/4 right-1/4 border border-cyan-500/20 rounded-[100%]"></div>
                </div>

                {/* Nodes and Connections (Static representation, spinning with globe) */}

                {/* Node: North America */}
                <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] -translate-x-1/2 -translate-y-1/2 group">
                    <div className="absolute w-8 h-8 rounded-full border border-emerald-400/50 -top-3 -left-3 animate-ping"></div>
                    {/* Connection Line to EU */}
                    <svg className="absolute top-1 left-1 w-40 h-20 overflow-visible pointer-events-none">
                        <path d="M 0 0 Q 30 -20 60 10" fill="transparent" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1" strokeDasharray="2,2" className="animate-[dash_10s_linear_infinite]" />
                    </svg>
                </div>

                {/* Node: Europe */}
                <div className="absolute top-[25%] left-[55%] w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] -translate-x-1/2 -translate-y-1/2 group">
                    <div className="absolute w-12 h-12 rounded-full border border-cyan-400/50 -top-4 -left-4 animate-pulse"></div>
                </div>

                {/* Node: South America */}
                <div className="absolute top-[70%] left-[30%] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] -translate-x-1/2 -translate-y-1/2">
                    {/* Connection Line to NA */}
                    <svg className="absolute bottom-1 left-1 w-20 h-40 overflow-visible pointer-events-none">
                        <path d="M 0 0 Q -10 -30 -10 -60" fill="transparent" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
                    </svg>
                </div>

                {/* Node: Asia */}
                <div className="absolute top-[40%] left-[80%] w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_12px_#facc15] -translate-x-1/2 -translate-y-1/2">
                </div>
            </div>

            {/* Foreground Hologram Gradients/Scanlines */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: 'linear-gradient(transparent 50%, rgba(6, 182, 212, 0.1) 50%)',
                    backgroundSize: '100% 4px'
                }}
            ></div>

            {/* Floating UI Elements (Fixed relative to container, not globe) */}
            <div className="absolute top-6 left-6 flex flex-col gap-4">
                <div className="bg-slate-900/60 border border-slate-700 p-3 rounded-lg backdrop-blur-md">
                    <div className="flex items-center gap-2 text-cyan-400 mb-2">
                        <Globe className="w-5 h-5 animate-pulse" />
                        <h3 className="font-bold text-sm tracking-widest uppercase">Global Nodes</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                            <span className="text-slate-400">Total Active</span>
                            <span className="text-white font-bold">12,409</span>
                        </div>
                        <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                            <span className="text-slate-400">Sync Status</span>
                            <span className="text-emerald-400 font-bold">OPTIMAL</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-6 right-6 flex flex-col gap-4">
                <div className="bg-slate-900/60 border border-slate-700 p-3 rounded-lg backdrop-blur-md w-48">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <Activity className="w-5 h-5" />
                        <h3 className="font-bold text-sm tracking-widest uppercase">Live Activity</h3>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">Real-time agricultural data transactions across FarmSense network.</p>
                    <div className="h-16 w-full flex items-end gap-1">
                        {/* Simulated Live Bar Chart */}
                        {[40, 70, 45, 90, 60, 85, 50, 75, 55, 65].map((h, i) => (
                            <div key={i} className="flex-1 bg-yellow-500/50 hover:bg-yellow-400 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 text-xs text-slate-500 flex items-center gap-2">
                <NetworkIcon className="w-4 h-4 text-cyan-500" />
                <span className="tracking-widest uppercase">Render Engine: FarmSense AR-Core v2.1</span>
            </div>

        </div>
    );
};
