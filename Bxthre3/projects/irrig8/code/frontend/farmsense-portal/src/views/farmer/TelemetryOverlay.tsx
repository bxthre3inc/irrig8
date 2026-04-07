import { useState, useEffect } from 'react';
import { Activity, Thermometer, Droplets, Zap } from 'lucide-react';

interface TelemetryUpdate {
    type: string;
    value: string;
    label: string;
    unit: string;
}

export const TelemetryOverlay = () => {
    const [updates, setUpdates] = useState<TelemetryUpdate[]>([]);

    useEffect(() => {
        const types = [
            { type: 'moisture', label: 'Soil Moisture', unit: '% vWC' },
            { type: 'temp', label: 'Ground Temp', unit: '°C' },
            { type: 'power', label: 'Node Voltage', unit: 'V' }
        ];

        const interval = setInterval(() => {
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomVal = (Math.random() * 100).toFixed(1);
            
            setUpdates(prev => [
                { ...randomType, value: randomVal },
                ...prev.slice(0, 4)
            ]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none flex flex-col gap-2 p-4">
            {updates.map((update, i) => (
                <div 
                    key={i} 
                    className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center justify-between w-64 animate-in slide-in-from-left duration-500"
                    style={{ opacity: 1 - (i * 0.2) }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-md">
                            {update.type === 'moisture' && <Droplets className="w-4 h-4 text-blue-400" />}
                            {update.type === 'temp' && <Thermometer className="w-4 h-4 text-orange-400" />}
                            {update.type === 'power' && <Zap className="w-4 h-4 text-yellow-400" />}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{update.label}</p>
                            <p className="text-sm font-black text-white">{update.value}<span className="text-[10px] text-slate-500 ml-1">{update.unit}</span></p>
                        </div>
                    </div>
                    <Activity className="w-3 h-3 text-emerald-500/50 animate-pulse" />
                </div>
            ))}
        </div>
    );
};
