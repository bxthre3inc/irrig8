import React from 'react';

interface CloudMaskTabProps {
    showCloudMask: boolean;
    setShowCloudMask: (show: boolean) => void;
}

export const CloudMaskTab: React.FC<CloudMaskTabProps> = ({
    showCloudMask,
    setShowCloudMask
}) => {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between bg-black/40 border border-blue-900/30 rounded-xl p-5">
                <div>
                    <p className="text-sm font-bold text-white">Cloud / Shadow Mask Overlay</p>
                    <p className="text-xs text-slate-500 mt-1">Sentinel-2 cloud mask applied to current overpass</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-400">{showCloudMask ? 'On' : 'Off'}</span>
                    <div className={`w-10 h-5 rounded-full transition-colors relative ${showCloudMask ? 'bg-blue-500' : 'bg-slate-700'}`} onClick={() => setShowCloudMask(!showCloudMask)}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${showCloudMask ? 'left-5' : 'left-0.5'}`} />
                    </div>
                </label>
            </div>

            <div className="bg-black/40 border border-blue-900/30 rounded-xl p-5">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">S2 Overpass — 2025-09-15</p>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    {[{ label: 'Cloud Coverage', value: '12.4%', color: 'text-amber-400' }, { label: 'Shadow Coverage', value: '4.1%', color: 'text-slate-400' }, { label: 'Clear Pixels', value: '83.5%', color: 'text-emerald-400' }].map(m => (
                        <div key={m.label} className="bg-black/30 rounded-lg p-3">
                            <p className={`text-xl font-black font-mono ${m.color}`}>{m.value}</p>
                            <p className="text-[10px] text-slate-600 mt-1">{m.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-black/40 border border-blue-900/30 rounded-xl p-5 space-y-3">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Alternate SAR Passes (Cloud-Penetrating)</p>
                {['2025-09-14 06:21 UTC — Ascending', '2025-09-12 18:09 UTC — Descending', '2025-09-09 06:20 UTC — Ascending'].map(pass => (
                    <div key={pass} className="flex items-center justify-between px-3 py-2.5 bg-black/30 rounded-lg border border-purple-900/30 hover:border-purple-500/40 cursor-pointer transition-colors">
                        <span className="text-xs font-mono text-slate-400">{pass}</span>
                        <span className="text-[10px] font-bold text-blue-400 border border-blue-900/50 rounded px-2 py-0.5">Select</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
