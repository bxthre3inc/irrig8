import { Layer } from './types';

export const ALL_LAYERS: Layer[] = [
    { id: 's1_vv', label: 'S1 VV Backscatter', source: 'Sentinel-1', color: '#60a5fa', unit: 'dB', value: -12.4 },
    { id: 's1_vh', label: 'S1 VH Backscatter', source: 'Sentinel-1', color: '#93c5fd', unit: 'dB', value: -19.7 },
    { id: 's2_ndvi', label: 'S2 NDVI', source: 'Sentinel-2', color: '#4ade80', unit: 'index', value: 0.72 },
    { id: 's2_ndwi', label: 'S2 NDWI', source: 'Sentinel-2', color: '#38bdf8', unit: 'index', value: 0.18 },
    { id: 's2_false', label: 'S2 False-Color', source: 'Sentinel-2', color: '#f97316', unit: 'RGB', value: 0 },
    { id: 'l8_lst', label: 'L8 LST Surface Temp', source: 'Landsat-8', color: '#fb923c', unit: '°C', value: 34.1 },
    { id: 'dem_elev', label: 'DEM Elevation', source: 'DEM', color: '#a78bfa', unit: 'm', value: 2340 },
    { id: 'dem_slope', label: 'DEM Slope', source: 'DEM', color: '#c4b5fd', unit: '°', value: 2.1 },
    { id: 'dem_twi', label: 'DEM TWI', source: 'DEM', color: '#e879f9', unit: 'idx', value: 7.4 },
];

export const corrMatrix = [
    [1.00, 0.87, 0.63, 0.41, 0.29],
    [0.87, 1.00, 0.71, 0.55, 0.38],
    [0.63, 0.71, 1.00, 0.68, 0.44],
    [0.41, 0.55, 0.68, 1.00, 0.59],
    [0.29, 0.38, 0.44, 0.59, 1.00],
];

export const corrLabels = ['NDVI', 'NDWI', 'LST', 'SMP', 'SWC'];
