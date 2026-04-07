/**
 * FarmSense Grant Profile Store
 * ─────────────────────────────
 * Persists known application field values to localStorage.
 * Used to prefill any future grant application form automatically.
 *
 * Wherever a grant form field is filled, call: saveProfileField(key, value)
 * When opening a new form, call: profile = getProfile() and spread into defaults.
 */

export interface GrantProfile {
    // Organization
    org_name?: string;
    org_legal_name?: string;
    ein?: string;               // Employer Identification Number
    sam_uei?: string;           // SAM.gov Unique Entity Identifier
    duns?: string;
    cage_code?: string;

    // Contact
    pi_name?: string;           // Principal Investigator
    pi_email?: string;
    pi_phone?: string;
    org_street?: string;
    org_city?: string;
    org_state?: string;
    org_zip?: string;

    // Farm / Field
    field_names?: string;       // comma-separated
    grower_id?: string;
    water_source_type?: string;
    application_method?: string;
    total_acres?: string;

    // Prior Season Metrics (auto-populated from FarmSense data)
    prev_season_water_applied_m3?: string;
    avg_ec_us_cm?: string;
    avg_yield_tonnes_per_ha?: string;
    nodes_deployed?: string;

    // Grant History
    owner?: string;
    default_agency?: string;
}

const PROFILE_KEY = 'farmsense_grant_profile';

export function getProfile(): GrantProfile {
    try {
        const raw = localStorage.getItem(PROFILE_KEY);
        return raw ? (JSON.parse(raw) as GrantProfile) : {};
    } catch {
        return {};
    }
}

export function saveProfileField(key: keyof GrantProfile, value: string): void {
    const current = getProfile();
    const updated = { ...current, [key]: value };
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    } catch {
        // Storage full or unavailable — fail silently
    }
}

export function clearProfile(): void {
    localStorage.removeItem(PROFILE_KEY);
}

// ── Draft Application Persistence ─────────────────────────────────────────────
// Individual applications are stored as drafts keyed by app ID.

const DRAFT_KEY_PREFIX = 'farmsense_grant_draft_';
const DRAFT_INDEX_KEY = 'farmsense_grant_drafts';

export interface ApplicationDraft {
    id: string;
    grant: string;
    agency: string;
    ask: string;
    deadline: string;
    owner: string;
    notes: string;
    savedAt: string;   // ISO timestamp
}

export function saveDraft(draft: ApplicationDraft): void {
    try {
        draft.savedAt = new Date().toISOString();
        localStorage.setItem(`${DRAFT_KEY_PREFIX}${draft.id}`, JSON.stringify(draft));
        // Update draft index
        const index = getDraftIds();
        if (!index.includes(draft.id)) {
            localStorage.setItem(DRAFT_INDEX_KEY, JSON.stringify([...index, draft.id]));
        }
    } catch { /* fail silently */ }
}

export function getDraft(id: string): ApplicationDraft | null {
    try {
        const raw = localStorage.getItem(`${DRAFT_KEY_PREFIX}${id}`);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

export function getDraftIds(): string[] {
    try {
        const raw = localStorage.getItem(DRAFT_INDEX_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

export function deleteDraft(id: string): void {
    try {
        localStorage.removeItem(`${DRAFT_KEY_PREFIX}${id}`);
        const index = getDraftIds().filter(i => i !== id);
        localStorage.setItem(DRAFT_INDEX_KEY, JSON.stringify(index));
    } catch { /* fail silently */ }
}

// ── React Hook ─────────────────────────────────────────────────────────────────

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * React hook for grant profile auto-save.
 *
 * Usage:
 *   const { profile, field, setField } = useGrantProfile();
 *   <input value={field('org_name')} onChange={e => setField('org_name', e.target.value)} />
 */
export function useGrantProfile() {
    const [profile, setProfile] = useState<GrantProfile>(getProfile);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setField = useCallback((key: keyof GrantProfile, value: string) => {
        setProfile(prev => ({ ...prev, [key]: value }));
        // Debounce the localStorage write — 500ms
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            saveProfileField(key, value);
        }, 500);
    }, []);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const field = useCallback((key: keyof GrantProfile): string => {
        return profile[key] ?? '';
    }, [profile]);

    return { profile, field, setField };
}
