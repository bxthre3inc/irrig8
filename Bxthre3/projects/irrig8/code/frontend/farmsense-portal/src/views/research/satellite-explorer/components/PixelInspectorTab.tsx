import React from 'react';
import { Crosshair } from 'lucide-react';
import { ALL_LAYERS } from '../constants';

interface PixelInspectorTabProps {
    pixelLat: string;
    setPixelLat: (lat: string) => void;
    pixelLon: string;
    setPixelLon: (lon: string) => void;
    inspectedPixel: { lat: string; lon: string } | null;
    setInspectedPixel: (pixel: { lat: string; lon: string } | null) => void;
    timeSeries: { month: string; ndvi: number; ssm: number }[];
    yieldData?: {
        forecast: number;
        stress: number;
        modifiers: { moisture: number; spectral: number; environmental: number };
    };
}

export const PixelInspectorTab: React.FC<PixelInspectorTabProps> = ({
    pixelLat,
    setPixelLat,
    pixelLon,
    setPixelLon,
    inspectedPixel,
    setInspectedPixel,
    timeSeries,
    yieldData
}) => {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Latitude</label>
                    <input value={pixelLat} onChange={e => setPixelLat(e.target.value)} className="w-full mt-1 bg-black/40 border border-blue-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-blue-500/60" />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Longitude</label>
                    <input value={pixelLon} onChange={e => setPixelLon(e.target.value)} className="w-full mt-1 bg-black/40 border border-blue-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-blue-500/60" />
                </div>
            </div>
            <button onClick={() => setInspectedPixel({ lat: pixelLat, lon: pixelLon })}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                <Crosshair className="w-4 h-4" /> Inspect Pixel
            </button>

            {inspectedPixel && (
                <>
                    <div className="bg-black/40 border border-blue-900/30 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Full Spectral Profile — {inspectedPixel.lat}°N, {Math.abs(Number(inspectedPixel.lon))}°W</p>
                        <div className="grid grid-cols-2 gap-2">
                            {ALL_LAYERS.filter(l => l.id !== 's2_false').map(l => (
                                <div key={l.id} className="flex justify-between text-xs px-3 py-1.5 bg-black/30 rounded-lg">
                                    <span className="text-slate-400">{l.label}</span>
                                    <span className="font-mono" style={{ color: l.color }}>{l.value} {l.unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/40 border border-blue-900/30 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">12-Month NDVI & SSM Time Series</p>
                        <div className="h-40 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-3">
                                {timeSeries.map(m => (
                                    <div key={m.month} className="flex items-center gap-2 text-[10px]">
                                        <span className="font-mono text-slate-500 w-6">{m.month}</span>
                                        <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden relative">
                                            <div className="absolute left-0 top-0 h-full bg-emerald-500/60 rounded-full" style={{ width: `${m.ndvi * 100}%` }} />
                                        </div>
                                        <span className="font-mono text-emerald-400 w-10">{m.ndvi}</span>
                                        <span className="font-mono text-blue-400 w-10">{m.ssm}</span>
                                    </div>
                                ))}
                                <div className="flex gap-4 text-[10px] text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />NDVI</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />SSM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-blue-900/30 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Vertical Moisture Profile (in)</p>
                            <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-tighter">
                                <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                                HVS Anchor Active
                            </span>
                        </div>
                        <div className="space-y-3">
                            {[10, 18, 25, 35, 48].map((depth, idx) => (
                                <div key={depth} className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-slate-500 w-8">{depth}"</span>
                                    <div className="flex-1 h-3 bg-black/30 rounded-lg overflow-hidden relative">
                                        <div
                                            className={`absolute left-0 top-0 h-full rounded-lg transition-all duration-1000 ${depth === 10 ? 'bg-blue-500/60' : 'bg-blue-400/40 border-l border-blue-400/30'}`}
                                            style={{ width: `${Math.max(15, 40 - (idx * 5))}%` }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-mono ${depth === 10 ? 'text-blue-400' : 'text-slate-500'}`}>
                                        {depth === 10 ? 'Physical' : 'VFA-Anchored'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 text-[9px] text-slate-500 italic leading-relaxed">
                            Deep-profile readings are superimposed from the nearest VFA anchor using HVS cross-zone relationship offsets.
                        </p>
                    </div>

                    {yieldData && (
                        <div className="bg-black/40 border border-amber-900/30 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Harvest Yield Forecast</p>
                                    <p className="text-[8px] text-amber-500/60 font-mono uppercase">MSF Fusion Engine v1.0</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-mono text-amber-400 font-bold">{yieldData.forecast.toLocaleString()}</span>
                                    <span className="text-[10px] text-amber-500/60 ml-2 font-bold uppercase tracking-widest">KG/HA</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-black/30 rounded-lg p-3 border border-amber-900/10">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Crop Stress Probability</span>
                                        <span className="text-[10px] font-mono text-amber-500 font-bold">{(yieldData.stress * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-1000"
                                            style={{ width: `${yieldData.stress * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-black/20 p-2 rounded border border-slate-800/40 text-center">
                                        <div className="text-[8px] text-slate-500 uppercase font-bold mb-1">Moisture</div>
                                        <div className="text-[10px] font-mono text-emerald-400">x{yieldData.modifiers.moisture.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded border border-slate-800/40 text-center">
                                        <div className="text-[8px] text-slate-500 uppercase font-bold mb-1">Spectral</div>
                                        <div className="text-[10px] font-mono text-emerald-400">x{yieldData.modifiers.spectral.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded border border-slate-800/40 text-center">
                                        <div className="text-[8px] text-slate-500 uppercase font-bold mb-1">Environ.</div>
                                        <div className="text-[10px] font-mono text-amber-400">x{yieldData.modifiers.environmental.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
