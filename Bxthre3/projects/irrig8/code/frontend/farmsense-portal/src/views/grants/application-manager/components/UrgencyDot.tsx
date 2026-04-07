import React from 'react';
import { daysUntil } from '../helpers';

export function UrgencyDot({ deadline }: { deadline: string }) {
    const d = daysUntil(deadline);
    const color = d <= 14 ? 'bg-red-500' : d <= 30 ? 'bg-amber-400' : d <= 60 ? 'bg-blue-400' : 'bg-slate-600';
    return <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${color}`} />;
}
