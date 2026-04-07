export type IntegrationStatus = 'active' | 'flagged' | 'offline';
export type WizardStep = 0 | 1 | 2 | 3;
export type Tab = 'registry' | 'wizard' | 'calibration' | 'scoring';

export interface Integration {
    id: string;
    name: string;
    type: string;
    lastSync: string;
    records: number;
    qualityScore: number;
    status: IntegrationStatus;
    drift: boolean;
}
