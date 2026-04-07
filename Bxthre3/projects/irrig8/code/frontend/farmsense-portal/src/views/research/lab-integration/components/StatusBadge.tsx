import React from 'react';
import { IntegrationStatus } from '../types';

export function StatusBadge({ status }: { status: IntegrationStatus }) {
    const cls = status === 'active' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' :
        status === 'flagged' ? 'bg-amber-950/30 border-amber-800/50 text-amber-400' :
            'bg-slate-900/40 border-slate-700 text-slate-500';
    const label = status === 'active' ? '● Active' : status === 'flagged' ? '⚠ Flagged' : '○ Offline';
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cls}`}>{label}</span>;
}
