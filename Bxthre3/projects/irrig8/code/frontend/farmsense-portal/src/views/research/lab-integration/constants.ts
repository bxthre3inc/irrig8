import { Integration } from './types';

export const MOCK_INTEGRATIONS: Integration[] = [
    { id: 'INT-001', name: 'CSU Soil Spectrometer (LIBS)', type: 'Spectrometer', lastSync: '2h ago', records: 18241, qualityScore: 96, status: 'active', drift: false },
    { id: 'INT-002', name: 'LIMS — Colorado State Lab', type: 'LIMS', lastSync: '6h ago', records: 4012, qualityScore: 88, status: 'active', drift: false },
    { id: 'INT-003', name: 'NRCS Weather Grid (Station 41)', type: 'Weather Network', lastSync: '14h ago', records: 97301, qualityScore: 61, status: 'flagged', drift: true },
    { id: 'INT-004', name: 'Eddy Covariance Flux Tower — SLV-A', type: 'Flux Tower', lastSync: '3d ago', records: 2108, qualityScore: 43, status: 'offline', drift: false },
];

export const INSTRUMENT_TYPES = ['Spectrometer (LIBS/XRF)', 'LIMS', 'Weather Station Network', 'Eddy Covariance Flux Tower', 'Custom IoT Sensor'];

export const FORMATS = ['REST API (JSON)', 'REST API (CSV)', 'SFTP File Upload', 'MQTT Push'];

export const FIELDS = [
    { id: 'FIELD-SLV-001', name: 'Field 1 — Center, CO' },
    { id: 'FIELD-SLV-002', name: 'Field 2 — Monte Vista, CO' },
];
