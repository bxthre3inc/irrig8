import React from 'react';
import { CloudRain, Wind, Thermometer, Sun } from 'lucide-react';

export const WeatherHUD: React.FC = () => {
    return (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4 z-40 pointer-events-none">
            {/* Weather Micro-animations background logic could be added here to full screen */}
            <div className="glass-card px-6 py-3 flex items-center gap-6 shadow-2xl border-white/10 backdrop-blur-xl animate-in slide-in-from-top duration-700">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <CloudRain className="w-6 h-6 text-blue-400" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 text-blue-400 animate-bounce">💧</div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precip</p>
                        <p className="text-sm font-black text-white">12.4 mm</p>
                    </div>
                </div>

                <div className="w-px h-8 bg-white/10"></div>

                <div className="flex items-center gap-3">
                    <Wind className="w-6 h-6 text-slate-300" />
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wind</p>
                        <p className="text-sm font-black text-white">14 km/h <span className="text-[10px] text-slate-500 font-bold ml-1">NW</span></p>
                    </div>
                </div>

                <div className="w-px h-8 bg-white/10"></div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Sun className="w-6 h-6 text-orange-400 animate-[spin_10s_linear_infinite]" />
                        <Thermometer className="w-4 h-4 text-rose-500 absolute -bottom-1 -right-1" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temp</p>
                        <p className="text-sm font-black text-white">28°C <span className="text-[10px] text-orange-400 ml-1">High</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
