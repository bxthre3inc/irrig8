import React from 'react';
import { Clock, ShieldCheck, Signature } from 'lucide-react';

interface TrustBadgeProps {
    status: 'pending' | 'signed' | 'verified';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ status }) => {
    if (status === 'verified') {
        return (
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative flex items-center gap-1.5 bg-gradient-to-b from-stone-900 to-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    Verified
                </div>
            </div>
        );
    }

    if (status === 'signed') {
        return (
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center gap-1.5 bg-gradient-to-b from-stone-900 to-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/30">
                    <Signature className="w-3.5 h-3.5 text-blue-300" />
                    Signed
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-bold uppercase tracking-wider text-stone-500 shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            Pending
        </div>
    );
};
