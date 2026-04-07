import React, { useState } from 'react';
import { Satellite, Layers, Crosshair, Grid, Cloud } from 'lucide-react';

// Modular imports
import type { Tab } from './satellite-explorer/types';
import { ALL_LAYERS } from './satellite-explorer/constants';
import { mockNdviTimeSeries } from './satellite-explorer/helpers';
import { LayersTab } from './satellite-explorer/components/LayersTab';
import { PixelInspectorTab } from './satellite-explorer/components/PixelInspectorTab';
import { CorrelationTab } from './satellite-explorer/components/CorrelationTab';
import { CloudMaskTab } from './satellite-explorer/components/CloudMaskTab';

type AttentionMode = 'DORMANT' | 'ANTICIPATORY' | 'RIPPLE' | 'COLLAPSE';

export const SatelliteCovariateExplorer: React.FC = () => {
    const [tab, setTab] = useState<Tab>('layers');
    const [enabledLayers, setEnabledLayers] = useState<Set<string>>(new Set(['s2_ndvi', 'l8_lst']));
    const [dateA, setDateA] = useState('2025-06-15');
    const [dateB, setDateB] = useState('2025-09-15');
    const [blend, setBlend] = useState(50);
    const [inspectedPixel, setInspectedPixel] = useState<{ lat: string; lon: string } | null>(null);
    const [pixelLat, setPixelLat] = useState('37.485');
    const [pixelLon, setPixelLon] = useState('-106.132');
    const [showCloudMask, setShowCloudMask] = useState(false);
    const [attentionMode, setAttentionMode] = useState<AttentionMode>('DORMANT');
    const [predictiveMode, setPredictiveMode] = useState(false);
    const [showVriOverlay, setShowVriOverlay] = useState(false);
    const [showYieldForecast, setShowYieldForecast] = useState(false);
    const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());
    const [timeSeries] = useState(mockNdviTimeSeries());

    // Simulation of dynamic engine behavior
    React.useEffect(() => {
        const interval = setInterval(() => {
            setAttentionMode(prev => {
                if (prev === 'DORMANT') return 'ANTICIPATORY';
                if (prev === 'ANTICIPATORY') return 'COLLAPSE';
                return 'DORMANT';
            });
            setLastSync(new Date().toLocaleTimeString());
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const toggleLayer = (id: string) => setEnabledLayers((prev: Set<string>) => {
        const next = new Set(prev);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        return next;
    });

    const activeLayers = ALL_LAYERS.filter(l => enabledLayers.has(l.id));

    const renderHeader = () => (
        <div className="flex items-center gap-3 px-6 py-4 border-b border-purple-900/30 bg-black/30">
            <div className="bg-blue-600/20 p-2 rounded-lg"><Satellite className="w-5 h-5 text-blue-400" /></div>
            <div>
                <h2 className="font-bold text-white text-sm tracking-wide">Satellite Covariate Science Suite</h2>
                <p className="text-[10px] text-blue-500 font-mono uppercase tracking-widest">Multi-layer spectral analysis explorer</p>
            </div>

            <div className="ml-10 flex gap-4">
                <button
                    onClick={() => setPredictiveMode(!predictiveMode)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${predictiveMode ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-black/40 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                >
                    PREDICTIVE {predictiveMode ? 'ON' : 'OFF'}
                </button>
                <button
                    onClick={() => setShowVriOverlay(!showVriOverlay)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${showVriOverlay ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-black/40 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                >
                    VRI OVERLAY {showVriOverlay ? 'ON' : 'OFF'}
                </button>
                <button
                    onClick={() => setShowYieldForecast(!showYieldForecast)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${showYieldForecast ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-black/40 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                >
                    YIELD FORECAST {showYieldForecast ? 'ON' : 'OFF'}
                </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-tighter border transition-all ${attentionMode === 'COLLAPSE' ? 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse' :
                    attentionMode === 'ANTICIPATORY' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' :
                        'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                    }`}>
                    {attentionMode} MODE
                </div>
                <div className="flex flex-col items-end gap-0.5">
                    <div className="text-[9px] font-mono text-slate-500 uppercase">Engine: RSS-1M-FHE</div>
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] text-emerald-500/70 font-bold uppercase tracking-widest">Pivot Sync: {lastSync}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTabs = () => (
        <div className="flex border-b border-purple-900/20 bg-black/20 px-6">
            {([['layers', 'Layers', Layers], ['pixel', 'Pixel Inspector', Crosshair], ['correlation', 'Correlation', Grid], ['cloud', 'Cloud Mask', Cloud]] as [Tab, string, React.ElementType][]).map(([id, label, Icon]) => (
                <button key={id} onClick={() => setTab(id)}
                    className={`py-3 px-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center gap-1.5 ${tab === id ? 'border-blue-500 text-blue-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                    <Icon className="w-3.5 h-3.5" />{label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="bg-[#070511] rounded-xl border border-purple-900/30 overflow-hidden flex flex-col min-h-[680px]">
            {renderHeader()}
            {renderTabs()}

            <div className="flex-1 overflow-y-auto p-6">
                {tab === 'layers' && (
                    <LayersTab
                        enabledLayers={enabledLayers}
                        toggleLayer={toggleLayer}
                        dateA={dateA}
                        setDateA={setDateA}
                        dateB={dateB}
                        setDateB={setDateB}
                        blend={blend}
                        setBlend={setBlend}
                        activeLayers={activeLayers}
                        attentionMode={attentionMode}
                        predictiveMode={predictiveMode}
                        showVriOverlay={showVriOverlay}
                    />
                )}

                {tab === 'pixel' && (
                    <PixelInspectorTab
                        pixelLat={pixelLat}
                        setPixelLat={setPixelLat}
                        pixelLon={pixelLon}
                        setPixelLon={setPixelLon}
                        inspectedPixel={inspectedPixel}
                        setInspectedPixel={setInspectedPixel}
                        timeSeries={timeSeries}
                        yieldData={showYieldForecast ? {
                            forecast: 11450,
                            stress: 0.12,
                            modifiers: { moisture: 0.95, spectral: 1.05, environmental: 0.98 }
                        } : undefined}
                    />
                )}

                {tab === 'correlation' && <CorrelationTab />}

                {tab === 'cloud' && (
                    <CloudMaskTab
                        showCloudMask={showCloudMask}
                        setShowCloudMask={setShowCloudMask}
                    />
                )}
            </div>
        </div>
    );
};

export default SatelliteCovariateExplorer;
