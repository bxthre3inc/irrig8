export type Layer = {
    id: string;
    label: string;
    source: string;
    color: string;
    unit: string;
    value: number;
};

export type Tab = 'layers' | 'pixel' | 'correlation' | 'cloud';
