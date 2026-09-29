/**
 * Centralized ReviveAI API Client
 * Ensures exact backend route resolution using NEXT_PUBLIC_API_URL or fallback.
 */

export const DEFAULT_BACKEND_URL = 'https://web-production-49943.up.railway.app';

export const getApiUrl = (endpoint: string): string => {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || DEFAULT_BACKEND_URL;
  baseUrl = baseUrl.trim().replace(/\/+$/, ''); // Strip trailing slashes

  // If baseUrl already ends with /api, remove /api so we have a clean root domain
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.slice(0, -4);
  }

  // Ensure endpoint starts with /
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Ensure path starts with /api/ unless it's /health
  if (cleanEndpoint !== '/health' && !cleanEndpoint.startsWith('/api/')) {
    if (cleanEndpoint === '/api') {
      cleanEndpoint = '/api';
    } else {
      cleanEndpoint = `/api${cleanEndpoint}`;
    }
  }

  return baseUrl ? `${baseUrl}${cleanEndpoint}` : cleanEndpoint;
};

export async function apiFetch<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = getApiUrl(endpoint);
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorDetail = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      } else if (errJson.message) {
        errorDetail = errJson.message;
      }
    } catch {
      // Ignore JSON parse failure on error responses
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

// Named API Helper Functions
export const api = {
  getDashboard: () => apiFetch('/api/dashboard'),
  getDashboardCharts: () => apiFetch('/api/dashboard/charts'),
  getDashboardTrends: () => apiFetch('/api/dashboard/trends'),
  getRiskAnalytics: () => apiFetch('/api/risk/analytics'),
  getTransactions: (params?: { page?: number; limit?: number; status?: string; payment_method?: string; provider?: string; failure_code?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.payment_method) query.append('payment_method', params.payment_method);
    if (params?.provider) query.append('provider', params.provider);
    if (params?.failure_code) query.append('failure_code', params.failure_code);
    if (params?.search) query.append('search', params.search);
    const qStr = query.toString();
    return apiFetch(`/api/transactions${qStr ? `?${qStr}` : ''}`);
  },
  getIncidents: () => apiFetch('/api/incidents'),
  getIncidentDetail: (incidentId: number) => apiFetch(`/api/incidents/${incidentId}`),
  createRecoveryPlan: (payload: { incident_id: number; strategy_code: string }) =>
    apiFetch('/api/recovery/plan', { method: 'POST', body: JSON.stringify(payload) }),
  approveRecoveryCampaign: (payload: { campaign_id: number; action: string; actor?: string; reason?: string }) =>
    apiFetch('/api/recovery/approve', { method: 'POST', body: JSON.stringify(payload) }),
  executeRecovery: (payload: { campaign_id: number; trigger_controlled_failure?: boolean }) =>
    apiFetch('/api/recovery/execute', { method: 'POST', body: JSON.stringify(payload) }),
  getCampaigns: () => apiFetch('/api/recovery/campaigns'),
  getCampaignDetail: (campaignId: number) => apiFetch(`/api/recovery/campaigns/${campaignId}`),
  startSimulator: (payload: { scenario: string; tpm?: number }) =>
    apiFetch('/api/simulator/start', { method: 'POST', body: JSON.stringify(payload) }),
  stopSimulator: () => apiFetch('/api/simulator/stop', { method: 'POST' }),
  resetSimulator: () => apiFetch('/api/simulator/reset', { method: 'POST' }),
  getAuditTrail: () => apiFetch('/api/audit'),
  getAnalytics: () => apiFetch('/api/analytics'),
  queryAgent: (payload: { query: string }) =>
    apiFetch('/api/agent/query', { method: 'POST', body: JSON.stringify(payload) }),
  getSimulatorStream: () => apiFetch('/api/simulator/stream'),
  getRiskPolicy: () => apiFetch('/api/risk/policy'),
  updateRiskPolicy: (payload: { max_monetary_exposure?: number; max_transaction_count?: number; max_failure_rate_threshold?: number; require_human_approval_above_exposure?: number }) =>
    apiFetch('/api/risk/policy', { method: 'PUT', body: JSON.stringify(payload) }),
  runDemo: () => apiFetch('/api/demo/run', { method: 'POST' }),
  getHealth: () => apiFetch('/health'),
};
