export type Stage = 'Identified' | 'Drafting' | 'Submitted' | 'Under Review' | 'Awarded' | 'Rejected';

export interface Application {
    id: string;
    grant: string;
    agency: string;
    ask: number;
    deadline: string;
    stage: Stage;
    owner: string;
    completionPct: number;
    notes: string;
    docs: string[];
    contacts: { name: string; role: string; email: string }[];
    draftSavedAt?: string;
}
