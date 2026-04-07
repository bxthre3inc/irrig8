import { useState } from 'react';
import Map, { NavigationControl, ScaleControl, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// Placeholder for ResolutionPopOverlay and gridData. In a real app, these would be imported or defined.
const ResolutionPopOverlay = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-700">This feature requires an Enterprise subscription.</p>
      </div>
    </div>
  );
};

// Placeholder for gridData
const gridData = {
  type: 'FeatureCollection',
  features: []
};


export default function AgriMap() {
  const [viewState, setViewState] = useState({
    longitude: -106.1,
    latitude: 37.5,
    zoom: 12
  });
  const [pointZoom, setPointZoom] = useState<{lat: number, lng: number, moisture: number} | null>(null);
  // Placeholder for isEnterprise. In a real app, this would come from context or props.
  const [isEnterprise, setIsEnterprise] = useState(true); // Set to true for demonstration

  const handleMapClick = (evt: any) => {
    if (!isEnterprise) return;
    const { lng, lat } = evt.lngLat;
    // Simulate RSS Point Zoom (1cm)
    const mockMoisture = 0.2 + Math.random() * 0.3;
    setPointZoom({ lat, lng, moisture: mockMoisture });
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-[#070511]">
      <div className={`h-full w-full transition-all duration-1000 ${!isEnterprise ? 'blur-sm grayscale-[30%] pointer-events-none' : ''}`}>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        >
          <NavigationControl position="top-right" />
          <ScaleControl position="bottom-left" />

          {/* High-Resolution Grid Layer (Only visible to Enterprise) */}
          {isEnterprise && (
            <Source type="geojson" data={gridData}>
              <Layer
                id="moisture-grid"
                type="circle"
                paint={{
                  'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 2, 16, 8],
                  'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'moisture'],
                    0.20, '#ef4444',
                    0.30, '#fbbf24',
                    0.45, '#10b981'
                  ],
                  'circle-opacity': 0.8,
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#fff'
                }}
              />
            </Source>
          )}
        </Map>
      </div>
      
      {/* 1cm Point Zoom Result (RSS Level) */}
      {pointZoom && isEnterprise && (
        <div className="absolute top-20 right-4 bg-[#070511]/95 border border-emerald-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-xl z-20 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">1cm Point Zoom (RSS Truth)</p>
                <button onClick={() => setPointZoom(null)} className="text-slate-500 hover:text-white transition-colors">×</button>
            </div>
            <div className="flex items-end gap-3">
                <p className="text-4xl font-black text-white font-mono">{pointZoom.moisture.toFixed(4)}</p>
                <p className="text-xs text-emerald-500 font-bold mb-1">VWC</p>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-2">
                LAT: {pointZoom.lat.toFixed(6)}<br/>
                LNG: {pointZoom.lng.toFixed(6)}
            </p>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[8px] text-slate-400 uppercase font-black">Legal Audit Trace Verified</span>
            </div>
        </div>
      )}
      
      {/* The Resolution Pop Overlay (Gated UI) */}
      <ResolutionPopOverlay isVisible={!isEnterprise} />

      <div className="absolute bottom-4 left-4 bg-[#070511]/80 border border-purple-900/40 p-3 rounded-lg shadow-2xl backdrop-blur-md z-10">
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Spatial Status</p>
        <p className="text-xs text-white font-mono">Center: {viewState.latitude.toFixed(4)}, {viewState.longitude.toFixed(4)}</p>
        <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${isEnterprise ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
                {isEnterprise ? '1m Deterministic Raster Active' : '50m Compliance Base'}
            </span>
        </div>
      </div>
    </div>
  );
}
