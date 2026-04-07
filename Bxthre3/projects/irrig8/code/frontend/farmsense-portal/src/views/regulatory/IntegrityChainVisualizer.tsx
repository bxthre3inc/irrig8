import React from 'react';
import { Database, Link2, ShieldCheck, AlertOctagon } from 'lucide-react';

interface IntegrityChainProps {
    hash: string;
    timestamp: string;
    action: string;
    isValid: boolean;
}

const Node: React.FC<IntegrityChainProps> = ({ hash, timestamp, action, isValid }) => (
    <div className="flex flex-col items-center relative z-10">
        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-black ${isValid ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
            {isValid ? <ShieldCheck className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
        </div>
        <div className="mt-4 text-center">
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{action}</p>
            <p className="text-xs font-mono text-white mt-1 break-all w-24 opacity-80">{hash.substring(0, 8)}...</p>
            <p className="text-[9px] font-mono text-slate-500 mt-0.5">{timestamp}</p>
        </div>
    </div>
);

export const IntegrityChainVisualizer: React.FC = () => {
    const mockChain: IntegrityChainProps[] = [
        { hash: '0x3f2a11b9e84c9d', timestamp: '10:02:14Z', action: 'SENSOR_INIT', isValid: true },
        { hash: '0x8a9b22c4f10d3a', timestamp: '10:15:22Z', action: 'DATA_WRITE', isValid: true },
        { hash: '0x1c4d55e6a92b8f', timestamp: '11:04:01Z', action: 'MANUAL_OVERRIDE', isValid: false },
        { hash: '0x9e2f44a8b11c7d', timestamp: '11:05:33Z', action: 'SYS_LOCKDOWN', isValid: true },
    ];

    return (
        <div className="w-full bg-[#0a0a0c] border border-blue-900/30 p-8 rounded-none relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-white to-blue-600"></div>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-mono font-bold text-white tracking-widest uppercase">Live Integrity Ledger</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Valid Block</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Anomaly Detected</span>
                </div>
            </div>

            <div className="relative pt-4 pb-8 flex justify-between items-start max-w-4xl mx-auto">
                {/* Connecting Line */}
                <div className="absolute top-[28px] left-[24px] right-[24px] h-0.5 bg-slate-800 z-0 flex items-center">
                    <div className="h-full bg-blue-500/50 w-[70%] transition-all duration-1000 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center text-red-500">
                            <Link2 className="w-4 h-4 -ml-2 bg-black z-20" />
                        </div>
                    </div>
                </div>

                {mockChain.map((node, i) => (
                    <Node key={i} {...node} />
                ))}
            </div>

            <div className="mt-4 border-t border-slate-800 pt-4 flex gap-8">
                <div className="text-xs font-mono text-slate-400">
                    <span className="text-blue-400 font-bold uppercase">{'>'} LATEST_HASH:</span> {mockChain[3].hash}
                </div>
                <div className="text-xs font-mono text-red-400 animate-pulse">
                    <span className="font-bold uppercase">{'>'} EXCEPTION DETECTED:</span> Unauthorized Manual Override at Block 3. Ledger branch frozen.
                </div>
            </div>
        </div>
    );
};
