import { useState, useEffect } from 'react';
import { AlertTriangle, Crosshair, Hexagon, Wifi, Battery, MapPin, Video } from 'lucide-react';

export const DroneARFeed = () => {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        // Random glitch effect
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.8) {
                setGlitch(true);
                setTimeout(() => setGlitch(false), 200);
            }
        }, 3000);
        return () => clearInterval(glitchInterval);
    }, []);

    return (
        <div className={`relative w-full h-[600px] bg-slate-950 overflow-hidden font-mono rounded-xl border border-slate-800 ${glitch ? 'animate-pulse' : ''}`}>
            {/* Simulated Drone Camera Feed Backdrop */}
            <div
                className="absolute inset-0 opacity-50 mix-blend-luminosity grayscale filter"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)',
                    backgroundSize: 'cover'
                }}
            ></div>

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            ></div>

            {/* Top HUD Bar */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start bg-gradient-to-b from-slate-950/80 to-transparent">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                        <Video className="w-5 h-5 animate-pulse" />
                        <span>DRONE-OVR-04 [REC]</span>
                    </div>
                    <p className="text-xs text-slate-400 tracking-widest">ALT: 124m | SPD: 24km/h</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Wifi className="w-4 h-4 text-emerald-400" />
                        <span>SIGNAL STABLE</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Battery className="w-4 h-4 text-orange-400" />
                        <span>42%</span>
                    </div>
                </div>
            </div>

            {/* Center Tactical Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-30 pointer-events-none">
                <Crosshair className="w-32 h-32 text-cyan-400/50" />
                <div className="absolute w-[200px] h-[1px] bg-cyan-400/20"></div>
                <div className="absolute w-[1px] h-[200px] bg-cyan-400/20"></div>
            </div>

            {/* Anomaly Targets (Bounding Boxes) */}

            {/* Target 1: Phosphorus Runoff moving Target */}
            <div className="absolute top-[30%] left-[20%] w-48 h-32 border-2 border-red-500/80 animate-[bounce_4s_infinite] group">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-500"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-500"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>

                {/* Target Info */}
                <div className="absolute -bottom-16 left-0 bg-red-950/80 border border-red-500/50 p-2 backdrop-blur-md whitespace-nowrap z-10">
                    <div className="flex items-center gap-2 text-red-500 mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest">DETECTED ANOMALY</span>
                    </div>
                    <p className="text-[10px] text-white">91% PROB: TARGET RUNOFF</p>
                    <p className="text-[9px] text-red-400 tracking-widest mt-1">CHEM: PHOSPHORUS TRACE</p>
                </div>
            </div>

            {/* Target 2: Normal Crop Inspection */}
            <div className="absolute top-[50%] right-[25%] w-32 h-32 border border-emerald-500/50 group">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-emerald-500"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-emerald-500"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-emerald-500"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-emerald-500"></div>

                {/* Target Info */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-900/80 border border-emerald-500/30 px-2 py-1 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <div className="flex items-center gap-1 text-emerald-400">
                        <Hexagon className="w-3 h-3" />
                        <span className="text-[10px] tracking-widest">SECTOR CLEAR</span>
                    </div>
                </div>
            </div>

            {/* Bottom Information Overlay */}
            <div className="absolute bottom-4 left-4 flex gap-4">
                <div className="flex flex-col">
                    <p className="text-[10px] text-slate-500 tracking-widest mb-1">ACTIVE DIRECTIVES</p>
                    <div className="flex flex-col gap-1">
                        <div className="bg-slate-900/60 border border-slate-700 px-3 py-1 rounded text-xs text-slate-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                            Scan Grid Alpha-7 for bio-markers
                        </div>
                        <div className="bg-slate-900/60 border border-slate-700 px-3 py-1 rounded text-xs text-slate-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                            Log Phosphorus signatures
                        </div>
                    </div>
                </div>
            </div>

            {/* Coordinate Mapping Overlay */}
            <div className="absolute bottom-4 right-4 flex items-end">
                <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-cyan-400 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest">GPS LOCK</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest">40.4173° N, 82.9071° W</p>
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest">HDG: 214° SW</p>
                </div>
            </div>
        </div>
    );
};
