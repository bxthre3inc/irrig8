export function corrColor(val: number): string {
    const abs = Math.abs(val);
    if (abs > 0.8) return 'bg-purple-600 text-white';
    if (abs > 0.6) return 'bg-purple-800/70 text-purple-100';
    if (abs > 0.4) return 'bg-purple-900/50 text-purple-300';
    return 'bg-black/40 text-slate-500';
}

export function mockNdviTimeSeries() {
    return Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        ndvi: parseFloat((0.3 + Math.sin(i / 12 * Math.PI * 2) * 0.3 + Math.random() * 0.05).toFixed(3)),
        ssm: parseFloat((0.2 + Math.cos(i / 12 * Math.PI * 2) * 0.1 + Math.random() * 0.03).toFixed(3)),
    }));
}
