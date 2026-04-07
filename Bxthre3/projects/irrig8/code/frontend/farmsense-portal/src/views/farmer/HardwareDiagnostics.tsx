import React, { useState } from 'react';
import { Cpu, Zap, Activity, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface HardwareDiagnosticsProps {
    onClose: () => void;
}

export const HardwareDiagnostics: React.FC<HardwareDiagnosticsProps> = ({ onClose }) => {
    const [activeNode] = useState('Gateway_A');

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="max-w-4xl w-full bg-[#050B14] border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col md:flex-row h-[600px] relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: 3D Wireframe Visualizer */}
                <div className="md:w-1/2 bg-gradient-to-b from-slate-900 to-black p-8 flex flex-col items-center justify-center relative border-r border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]"></div>

                    {/* Mock 3D Wireframe utilizing CSS transformations */}
                    <div className="relative w-64 h-96 [perspective:1000px] group">
                        <div className="w-full h-full relative [transform-style:preserve-3d] [transform:rotateX(15deg)_rotateY(30deg)] group-hover:[transform:rotateX(15deg)_rotateY(50deg)] transition-transform duration-1000 ease-out">
                            {/* Antenna / Comm Link */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-24 bg-emerald-500/20 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                <div className="absolute -top-2 -left-1 w-4 h-4 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20"></div>
                            </div>

                            {/* Main Body */}
                            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-16 h-32 bg-slate-800/80 backdrop-blur border border-white/20 rounded-md flex items-center justify-center inset-shadow-sm">
                                <Cpu className="w-8 h-8 text-emerald-500/50" />
                            </div>

                            {/* Probes */}
                            <div className="absolute top-56 left-1/2 -translate-x-1/2 w-4 h-32 bg-orange-500/20 border border-orange-500/50 [transform:translateZ(10px)]">
                                <div className="absolute bottom-4 -left-16 text-[10px] font-black tracking-widest text-orange-400 bg-black/80 px-2 py-1 border border-orange-500/30 rounded flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span> 10cm: 22%
                                </div>
                                <div className="absolute bottom-16 -right-16 text-[10px] font-black tracking-widest text-blue-400 bg-black/80 px-2 py-1 border border-blue-500/30 rounded flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span> 48cm: 31%
                                </div>
                            </div>

                            {/* Base Plane */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 border border-white/10 rounded-full [transform:rotateX(90deg)_translateZ(40px)] shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(255,255,255,0.05)_20px,rgba(255,255,255,0.05)_21px)] rounded-full"></div>
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.05)_20px,rgba(255,255,255,0.05)_21px)] rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-6 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Live Digital Twin
                    </div>
                </div>

                {/* Right Side: Data & Controls */}
                <div className="md:w-1/2 flex flex-col bg-[#0B1220]">
                    <div className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-widest rounded border border-emerald-500/20">Online</span>
                            <h2 className="text-2xl font-black text-white tracking-tight">VFA Node Status</h2>
                        </div>
                        <p className="text-sm font-mono text-slate-400">ID: {activeNode} | Lat: 40.0012 | Lon: -105.0045</p>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Battery Level</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-black text-white">4.1<span className="text-sm text-slate-500 ml-1">V</span></p>
                                    <div className="flex-1 h-2 bg-slate-800 rounded-full mb-1.5 ml-2">
                                        <div className="w-[85%] h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Signal (LoRa)</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-black text-white">-85<span className="text-sm text-slate-500 ml-1">dBm</span></p>
                                    <div className="flex gap-1 mb-1.5 ml-2">
                                        <div className="w-1.5 h-1 bg-emerald-500"></div>
                                        <div className="w-1.5 h-2 bg-emerald-500"></div>
                                        <div className="w-1.5 h-3 bg-emerald-500"></div>
                                        <div className="w-1.5 h-4 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Integrity Check</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-medium text-slate-200">Nitrogen Pressure (22 PSI)</span>
                                    </div>
                                    <span className="text-xs font-mono text-emerald-400">PASSED</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <ShieldAlert className="w-4 h-4 text-orange-400" />
                                        <span className="text-sm font-medium text-slate-200">Sensor 10cm Calibration</span>
                                    </div>
                                    <span className="text-xs font-mono text-orange-400">DRIFT +0.2</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <button
                                onClick={async () => {
                                    const btn = document.activeElement as HTMLButtonElement;
                                    if (!btn) return;
                                    const originalText = btn.innerText;
                                    btn.disabled = true;
                                    btn.innerText = "Rebooting Node...";
                                    // Simulate API call
                                    await new Promise(r => setTimeout(r, 2000));
                                    btn.innerText = "Reboot Successful";
                                    setTimeout(() => {
                                        btn.disabled = false;
                                        btn.innerText = originalText;
                                    }, 2000);
                                }}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors border border-white/10 flex justify-center items-center gap-2 group">
                                <Zap className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" /> Reboot Sensor Node
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
