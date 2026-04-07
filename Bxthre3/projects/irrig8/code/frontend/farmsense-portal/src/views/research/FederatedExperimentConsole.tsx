import React, { useState } from 'react';
import { FlaskConical, Play, ShieldCheck, Activity, BarChart2, BookOpen, ChevronRight, CheckCircle2, XCircle, HelpCircle, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

type ExperimentStatus = 'idle' | 'privacy_review' | 'training' | 'complete';
type ResultClass = 'Confirmed' | 'Rejected' | 'Inconclusive';

const FEATURES = ['EC (Electrical Conductivity)', 'SMP (Soil Matric Potential)', 'VPD (Vapor Pressure Deficit)', 'ET Forecast (LSTM)', 'Rainfall Preceding Days'];
const COHORTS = ['Rio Grande Basin — Corn', 'SLV Subdistrict 1 — Alfalfa', 'Southern CO — Wheat', 'Global Pool (Anonymized)'];

function generateLossData(epochs: number) {
    let loss = 1.0;
    return Array.from({ length: epochs }, (_, i) => {
        loss *= 0.92 - Math.random() * 0.04;
        return { epoch: i + 1, loss: parseFloat(loss.toFixed(4)), accuracy: parseFloat((1 - loss * 0.8).toFixed(4)) };
    });
}

const MOCK_REGISTRY = [
    { id: 'EXP-441', hypothesis: 'Predict NDVI decline at day+14 from EC and VPD', status: 'Confirmed', rmse: 0.042, r2: 0.91, institution: 'CSU — Agronomy Dept.' },
    { id: 'EXP-398', hypothesis: 'SMP alone can predict irrigation trigger within ±6h', status: 'Rejected', rmse: 0.178, r2: 0.44, institution: 'Anon. Institution' },
    { id: 'EXP-412', hypothesis: 'ET + rainfall delta predicts runoff risk class', status: 'Inconclusive', rmse: 0.095, r2: 0.67, institution: 'USDA ARS' },
];

const StatusIcon = ({ s }: { s: ResultClass | string }) =>
    s === 'Confirmed' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
        s === 'Rejected' ? <XCircle className="w-4 h-4 text-red-400" /> :
            <HelpCircle className="w-4 h-4 text-yellow-400" />;

export const FederatedExperimentConsole: React.FC = () => {
    const [tab, setTab] = useState<'builder' | 'monitor' | 'results' | 'registry'>('builder');
    const [status, setStatus] = useState<ExperimentStatus>('idle');
    const [hypothesis, setHypothesis] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [cohort, setCohort] = useState(COHORTS[0]);
    const [epochs, setEpochs] = useState(40);
    const [lr, setLr] = useState(0.001);
    const [privacyAck, setPrivacyAck] = useState(false);
    const [trainingData, setTrainingData] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);

    const toggleFeature = (f: string) =>
        setSelectedFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

    const handleSubmit = () => {
        if (!hypothesis || selectedFeatures.length === 0) return;
        setStatus('privacy_review');
        setTab('monitor');
    };

    const handlePrivacyAck = () => {
        if (!privacyAck) return;
        setStatus('training');
        const data = generateLossData(epochs);
        setTrainingData([]);
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setTrainingData(data.slice(0, i));
            setProgress(Math.round((i / epochs) * 100));
            if (i >= epochs) {
                clearInterval(interval);
                setStatus('complete');
            }
        }, 80);
    };

    return (
        <div className="bg-[#070511] rounded-xl border border-purple-900/30 overflow-hidden flex flex-col h-full min-h-[700px]">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-900/30 bg-black/30">
                <div className="bg-purple-600/20 p-2 rounded-lg"><FlaskConical className="w-5 h-5 text-purple-400" /></div>
                <div>
                    <h2 className="font-bold text-white text-sm tracking-wide">Federated Learning Experiment Console</h2>
                    <p className="text-[10px] text-purple-500 font-mono uppercase tracking-widest">Distributed model training over anonymized global sensor pool</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-purple-900/20 bg-black/20 px-6">
                {(['builder', 'monitor', 'results', 'registry'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`py-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${tab === t ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                        {t === 'builder' ? '1. Build' : t === 'monitor' ? '2. Monitor' : t === 'results' ? '3. Results' : 'Registry'}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {/* BUILDER TAB */}
                {tab === 'builder' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Hypothesis</label>
                            <textarea rows={2} value={hypothesis} onChange={e => setHypothesis(e.target.value)}
                                placeholder="e.g. Predict NDVI decline at day+14 from EC and VPD readings…"
                                className="w-full bg-black/40 border border-purple-900/40 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 resize-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Input Features</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {FEATURES.map(f => (
                                    <button key={f} onClick={() => toggleFeature(f)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-left transition-all ${selectedFeatures.includes(f) ? 'bg-purple-600/20 border-purple-500/60 text-purple-200' : 'bg-black/30 border-purple-900/30 text-slate-400 hover:border-purple-700/50'}`}>
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${selectedFeatures.includes(f) ? 'bg-purple-400' : 'bg-slate-700'}`} />
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Field Cohort</label>
                                <select value={cohort} onChange={e => setCohort(e.target.value)}
                                    className="w-full bg-black/40 border border-purple-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500/60">
                                    {COHORTS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Epochs</label>
                                    <input type="number" value={epochs} onChange={e => setEpochs(Number(e.target.value))} min={10} max={200}
                                        className="w-full bg-black/40 border border-purple-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500/60" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Learn Rate</label>
                                    <input type="number" value={lr} onChange={e => setLr(Number(e.target.value))} step={0.0001}
                                        className="w-full bg-black/40 border border-purple-900/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500/60" />
                                </div>
                            </div>
                        </div>
                        <button onClick={handleSubmit} disabled={!hypothesis || selectedFeatures.length === 0}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors">
                            <Play className="w-4 h-4" /> Submit to CSE Cluster <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* MONITOR TAB */}
                {tab === 'monitor' && (
                    <div className="space-y-6">
                        {status === 'privacy_review' && (
                            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-6 space-y-4">
                                <div className="flex items-center gap-2 text-amber-400 font-bold"><ShieldCheck className="w-5 h-5" /> Privacy Compliance Gate</div>
                                <p className="text-sm text-amber-200/70">Before submission, confirm the following:</p>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    {['Job uses only contextually anonymized data', 'No query can reconstruct individual farm GPS or identity', 'Output model parameters do not encode individual-level information'].map(item => (
                                        <li key={item} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />{item}</li>
                                    ))}
                                </ul>
                                <label className="flex items-center gap-3 cursor-pointer mt-2">
                                    <input type="checkbox" checked={privacyAck} onChange={e => setPrivacyAck(e.target.checked)} className="w-4 h-4 accent-purple-500" />
                                    <span className="text-sm text-slate-300 font-medium">I acknowledge as Research Coordinator</span>
                                </label>
                                <button onClick={handlePrivacyAck} disabled={!privacyAck}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors mt-2">
                                    <Play className="w-4 h-4" /> Begin Training
                                </button>
                            </div>
                        )}

                        {(status === 'training' || status === 'complete') && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                                        {status === 'training' ? <Loader2 className="w-4 h-4 text-purple-400 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                        {status === 'training' ? `Training... Epoch ${trainingData.length}/${epochs}` : `Training Complete — ${epochs} Epochs`}
                                    </div>
                                    <span className="text-xs font-mono text-purple-400">{progress}%</span>
                                </div>
                                <div className="w-full bg-purple-950/50 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[{ label: 'Current Loss', value: trainingData[trainingData.length - 1]?.loss ?? '—' }, { label: 'Accuracy', value: trainingData[trainingData.length - 1]?.accuracy ?? '—' }, { label: 'ETA', value: status === 'complete' ? 'Done' : `~${Math.round((epochs - trainingData.length) * 0.08)}s` }].map(m => (
                                        <div key={m.label} className="bg-black/40 rounded-xl border border-purple-900/30 p-4 text-center">
                                            <p className="text-2xl font-black font-mono text-white">{m.value}</p>
                                            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mt-1">{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-black/40 rounded-xl border border-purple-900/30 p-4 h-56">
                                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">Loss / Accuracy Curves</p>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trainingData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2D1B4E" vertical={false} />
                                            <XAxis dataKey="epoch" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                            <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10 }} domain={[0, 1]} />
                                            <Tooltip contentStyle={{ backgroundColor: '#070511', borderColor: '#3b0764', borderRadius: '8px', color: '#e9d5ff', fontSize: 12 }} />
                                            <Line type="monotone" dataKey="loss" stroke="#a855f7" strokeWidth={2} dot={false} />
                                            <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                {status === 'complete' && (
                                    <button onClick={() => setTab('results')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                                        <BarChart2 className="w-4 h-4" /> View Results <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </>
                        )}

                        {status === 'idle' && (
                            <div className="text-center py-16 text-slate-500">
                                <Activity className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No experiment running. Build one first.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* RESULTS TAB */}
                {tab === 'results' && (
                    <div className="space-y-5">
                        {status !== 'complete' ? (
                            <div className="text-center py-16 text-slate-500"><BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-20" /><p className="text-sm">Run an experiment to see results.</p></div>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-3">
                                    {[{ label: 'RMSE', value: '0.038' }, { label: 'R²', value: '0.944' }, { label: 'AUC', value: '0.961' }].map(m => (
                                        <div key={m.label} className="bg-black/40 rounded-xl border border-emerald-900/30 p-4 text-center">
                                            <p className="text-3xl font-black font-mono text-emerald-400">{m.value}</p>
                                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1">{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-black/40 rounded-xl border border-purple-900/30 p-5 space-y-3">
                                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">Feature Importance</p>
                                    {[{ name: 'VPD', pct: 81 }, { name: 'EC', pct: 64 }, { name: 'ET Forecast', pct: 57 }, { name: 'SMP', pct: 43 }, { name: 'Rainfall', pct: 29 }].map(f => (
                                        <div key={f.name}>
                                            <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{f.name}</span><span className="font-mono">{f.pct}%</span></div>
                                            <div className="w-full bg-purple-950/50 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${f.pct}%` }} /></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-5">
                                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Plain-English Summary</p>
                                    <p className="text-sm text-slate-300">VPD and EC are the dominant predictors of NDVI decline at day+14. The model achieves high R² (0.944) and low RMSE (0.038), suggesting <strong className="text-white">hypothesis is Confirmed</strong> at α=0.05.</p>
                                </div>
                                <div className="flex gap-2">
                                    {(['Confirmed', 'Rejected', 'Inconclusive'] as ResultClass[]).map(c => (
                                        <button key={c} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${c === 'Confirmed' ? 'bg-emerald-600/20 border-emerald-600/50 text-emerald-300 hover:bg-emerald-600/30' : c === 'Rejected' ? 'bg-red-900/20 border-red-800/40 text-red-400 hover:bg-red-900/30' : 'bg-yellow-900/20 border-yellow-800/40 text-yellow-400 hover:bg-yellow-900/30'}`}>{c}</button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* REGISTRY TAB */}
                {tab === 'registry' && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Community Experiment Registry</p>
                            <span className="text-[10px] text-slate-500 font-mono">{MOCK_REGISTRY.length} experiments</span>
                        </div>
                        {MOCK_REGISTRY.map(exp => (
                            <div key={exp.id} className="bg-black/40 border border-purple-900/30 rounded-xl p-4 hover:border-purple-700/50 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-mono text-purple-500">{exp.id}</span>
                                            <span className="text-[10px] text-slate-600">·</span>
                                            <span className="text-[10px] text-slate-500">{exp.institution}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 italic">"{exp.hypothesis}"</p>
                                        <div className="flex gap-4 mt-2 text-[10px] font-mono text-slate-500">
                                            <span>RMSE: <span className="text-slate-300">{exp.rmse}</span></span>
                                            <span>R²: <span className="text-slate-300">{exp.r2}</span></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0"><StatusIcon s={exp.status} /><span className={`text-[10px] font-bold ${exp.status === 'Confirmed' ? 'text-emerald-400' : exp.status === 'Rejected' ? 'text-red-400' : 'text-yellow-400'}`}>{exp.status}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FederatedExperimentConsole;
