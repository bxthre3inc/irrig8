import { useEffect, useState } from 'react';
import { TrendingUp, CloudRain, ThermometerSun, AlertTriangle, Loader2 } from 'lucide-react';
import { getApiKey } from '../../services/api';

interface DailyForecast {
    day: number;
    date: string;
    avg_moisture: number;
    avg_temperature: number;
    stress_index: number;
}

interface ForecastData {
    field_id: string;
    forecast_days: number;
    predictions: DailyForecast[];
}

export const ForecastWidget: React.FC<{ fieldId?: string }> = ({ fieldId = 'field_01' }) => {
    const [data, setData] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                setLoading(true);
                const token = getApiKey();
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`; 
                }
                const res = await fetch(`http://localhost:8000/api/v1/analytics/forecast?field_id=${fieldId}`, { headers });
                if (!res.ok) throw new Error('Failed to fetch forecast');
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchForecast();
    }, [fieldId]);

    if (loading) {
        return (
            <div className="bg-slate-900/50 backdrop-blur-md p-6 h-64 flex flex-col items-center justify-center border-l-4 border-indigo-500">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center">Initialising ML Forecast Engine...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-slate-900/50 backdrop-blur-md p-6 h-64 flex flex-col items-center justify-center border-l-4 border-red-500">
                <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
                <p className="text-sm text-red-200 text-center">{error || 'Forecast unavailable'}</p>
            </div>
        );
    }

    const maxMoisture = Math.max(...data.predictions.map(d => d.avg_moisture), 0.5);

    return (
        <div className="bg-slate-900/50 backdrop-blur-md p-6 flex flex-col h-full border-l-4 border-indigo-500 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        {data.forecast_days}-Day Predictive Forecast
                    </h3>
                    <p className="text-[10px] text-indigo-200/60 font-medium tracking-tight mt-1">Random Forest / Kriging Ensembles - Field {data.field_id}</p>
                </div>
                <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    Live Model
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 relative z-10 h-48 mt-4 border-b border-indigo-500/20 pb-2">
                {data.predictions.map((day, idx) => {
                    const moistureHeight = `${(day.avg_moisture / maxMoisture) * 100}%`;
                    const dayDate = new Date(day.date);
                    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group/bar relative">
                            {/* Tooltip */}
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-indigo-500/50 rounded-lg p-2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-20 min-w-16 shadow-xl text-center">
                                <p className="text-[10px] text-blue-400 flex items-center gap-1 justify-center"><CloudRain className="w-3 h-3" /> {(day.avg_moisture * 100).toFixed(0)}%</p>
                                <p className="text-[10px] text-orange-400 flex items-center gap-1 mt-0.5 justify-center"><ThermometerSun className="w-3 h-3" /> {day.avg_temperature.toFixed(0)}°C</p>
                            </div>

                            {/* Stress Indicator Line (Top) */}
                            <div
                                className="w-full bg-rose-500/50 mb-1 rounded-t-sm"
                                style={{ height: `${day.stress_index * 15}px` }}
                            ></div>

                            {/* Moisture Bar */}
                            <div
                                className="w-full max-w-[20px] bg-blue-500/20 border-t border-blue-400/50 rounded-t-sm transition-all duration-500 relative"
                                style={{ height: moistureHeight }}
                            >
                                <div className="absolute bottom-0 w-full bg-blue-500/40 h-full"></div>
                            </div>

                            <div className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                {idx === 0 ? 'Tdy' : dayName}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5 relative z-10 text-[9px] uppercase font-bold tracking-widest text-slate-500">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500/50 border border-blue-400"></span> Moisture</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-rose-500/50"></span> Stress</div>
                </div>
            </div>
        </div>
    );
};

export default ForecastWidget;
