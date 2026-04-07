import { Stage, Application } from './types';

export const STAGES: Stage[] = ['Identified', 'Drafting', 'Submitted', 'Under Review', 'Awarded', 'Rejected'];

export const STAGE_COLORS: Record<Stage, string> = {
    'Identified': 'border-slate-700 bg-slate-800/50',
    'Drafting': 'border-blue-800/50 bg-blue-900/10',
    'Submitted': 'border-purple-800/50 bg-purple-900/10',
    'Under Review': 'border-amber-800/40 bg-amber-900/10',
    'Awarded': 'border-emerald-800/40 bg-emerald-900/10',
    'Rejected': 'border-red-900/40 bg-red-900/10',
};

export const STAGE_HEADER: Record<Stage, string> = {
    'Identified': 'text-slate-400',
    'Drafting': 'text-blue-400',
    'Submitted': 'text-purple-400',
    'Under Review': 'text-amber-400',
    'Awarded': 'text-emerald-400',
    'Rejected': 'text-red-400',
};

export const SEED_APPS: Application[] = [
    { id: 'APP-001', grant: 'Federal Federal ESG — Water Resilience', agency: 'Federal Federal ESG', ask: 2400000, deadline: '2026-03-26', stage: 'Drafting', owner: 'Admin', completionPct: 62, notes: 'Pre-proposal drafted. Need Fort Carson POC for site access section.', docs: ['ESTCP_PreProposal_Draft.md', 'Budget_Narrative_v1.xlsx'], contacts: [{ name: 'Col. R. Martinez', role: 'Federal ESG Program Manager', email: 'r.martinez@estcp.osd.mil' }] },
    { id: 'APP-002', grant: 'LOR Foundation — Introduction Call', agency: 'LOR Foundation', ask: 0, deadline: '2026-02-26', stage: 'Under Review', owner: 'Admin', completionPct: 80, notes: 'First call Thursday Feb 26. Call brief prepared.', docs: ['LOR_Foundation_Call_Brief.md'], contacts: [{ name: 'Program Officer (TBD)', role: 'Water Program', email: '' }] },
    { id: 'APP-003', grant: 'USDA NRCS EQIP — Water Conservation', agency: 'USDA NRCS EQIP', ask: 300000, deadline: '2026-04-15', stage: 'Identified', owner: 'Admin', completionPct: 10, notes: 'Need to identify local NRCS office contact.', docs: [], contacts: [] },
];
