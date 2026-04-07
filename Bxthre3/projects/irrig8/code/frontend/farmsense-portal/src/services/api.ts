/**
 * FarmSense Unified API Client
 * Merged from all portal api.ts files.
 * Token stored in sessionStorage under 'farmsense_auth'.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

function getToken(): string {
    try {
        const stored = sessionStorage.getItem('farmsense_auth');
        if (!stored) return '';
        return JSON.parse(stored).token ?? '';
    } catch { return ''; }
}

async function request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? 'API request failed');
    }

    return res.json() as Promise<T>;
}

// ── Admin ──────────────────────────────────────────────────────────────────
export const admin = {
    getUsers: () => request('/admin/users'),
    createUser: (data: unknown) => request('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    updateUser: (id: string, d: unknown) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    getMetrics: () => request('/admin/metrics'),
};

// ── Fields / Farmer ────────────────────────────────────────────────────────
export const fields = {
    list: () => request('/fields'),
    get: (id: string) => request(`/fields/${id}`),
    getTelemetry: (id: string) => request(`/fields/${id}/telemetry`),
    getGrid: (id: string, res: string) => request(`/fields/${id}/grid?resolution=${res}`),
    getAlerts: (id: string) => request(`/fields/${id}/alerts`),
    getForecast: (id: string) => request(`/analytics/forecast?field_id=${id}`),
};

// ── Research ───────────────────────────────────────────────────────────────
export const research = {
    getKrigingWorksheets: () => request('/research/kriging'),
    getSatelliteCovariates: () => request('/research/satellite'),
    getFederatedExperiments: () => request('/research/federated'),
    getFieldTrials: () => request('/research/trials'),
    getOpenData: () => request('/research/open-data'),
    getBasinAnalytics: () => request('/research/basin'),
    getSPACModels: () => request('/research/spac'),
    getLabData: () => request('/research/lab'),
};

// ── Grants ─────────────────────────────────────────────────────────────────
export const grants = {
    listOpportunities: () => request('/grants/opportunities'),
    listApplications: () => request('/grants/applications'),
    createApplication: (d: unknown) => request('/grants/applications', { method: 'POST', body: JSON.stringify(d) }),
    updateApplication: (id: string, d: unknown) => request(`/grants/applications/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    listAwards: () => request('/grants/awards'),
    // Reviewer endpoints
    listSubmissions: () => request('/grants/submissions'),
    addNote: (id: string, d: unknown) => request(`/grants/submissions/${id}/notes`, { method: 'POST', body: JSON.stringify(d) }),
};

// ── Regulatory ─────────────────────────────────────────────────────────────
export const regulatory = {
    getLedger: (fieldId: string) => request(`/regulatory/ledger?field_id=${fieldId}`),
    getBasinSummary: () => request('/regulatory/basin'),
    generateReport: (d: unknown) => request('/regulatory/report', { method: 'POST', body: JSON.stringify(d) }),
    validateCompliance: (fieldId: string) => request(`/compliance/reports?field_id=${fieldId}`),
    listReports: (fieldId: string) => request(`/compliance/reports?field_id=${fieldId}`),
};

// ── Compliance / GLOBALG.A.P. ──────────────────────────────────────────────
export const compliance = {
    generateGAPReport: (d: unknown) => request('/compliance/reports/gap/generate', { method: 'POST', body: JSON.stringify(d) }),
    getLatestGAPReport: (fieldId: string) => request(`/compliance/reports/gap/${fieldId}/latest`),
    getControlPoints: () => request('/compliance/reports/gap/control-points'),
};

// ── Investor ───────────────────────────────────────────────────────────────
export const investor = {
    getImpactSummary: () => request('/investor/impact'),
    getFleetCoverage: () => request('/investor/fleet'),
    getWaterROI: () => request('/investor/water-roi'),
    buyIn: (amount: number) => request('/investor/buy-in', { method: 'POST', body: JSON.stringify({ amount }) }),
};

// ── Spatial Privacy ────────────────────────────────────────────────────────
export const privacy = {
    anonymize: (d: unknown) => request('/analytics/privacy/anonymize', { method: 'POST', body: JSON.stringify(d) }),
    getTiers: () => request('/analytics/privacy/tiers'),
};

// ── Letters / Signatures (Grant Portal public) ─────────────────────────────
export const letters = {
    list: () => request('/letters'),
    sign: (token: string, sig: string) => request(`/letters/${token}/sign`, { method: 'POST', body: JSON.stringify({ signature_data: sig }) }),
    getSupportLetters: (grantId: string) => request(`/letters/support?grant_id=${grantId}`),
    requestSupportLetter: (grantId: string, data: unknown) => request(`/letters/support?grant_id=${grantId}`, { method: 'POST', body: JSON.stringify(data) }),
    verifySupportLetter: (id: string, status: string) => request(`/grants/letters/${id}/verify`, { method: 'POST', body: JSON.stringify({ status }) }),
    signSupportLetter: (id: string, signature: string) => request(`/grants/letters/${id}/sign`, { method: 'POST', body: JSON.stringify({ signature }) }),
};

export const getApiKey = () => 'mock-api-key';

export const api = { admin, fields, research, grants, regulatory, compliance, investor, privacy, letters };
