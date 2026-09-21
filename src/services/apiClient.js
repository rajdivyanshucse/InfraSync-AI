/**
 * InfraSync AI — Centralized REST API Client
 * Robust fetch abstraction with timeout, structured errors, and fallback support.
 */

import { getApiUrl, API_CONFIG } from '../config/api';

class ApiError extends Error {
  constructor(message, code = 'NETWORK_ERROR', status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Executes a network request with timeout
 */
async function request(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || API_CONFIG.TIMEOUT_MS);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Inject active prototype session identity if available
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('infrasync_prototype_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role) {
          defaultHeaders['x-user-role'] = parsed.role;
          defaultHeaders['x-user-id'] = parsed.userId || `usr-${parsed.role}`;
          defaultHeaders['Authorization'] = `Bearer demo-${parsed.role.replace('_', '-')}`;
        }
      }
    }
  } catch (e) {
    console.warn('[ApiClient] Failed to read auth header from storage:', e.message);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorCode = data?.error?.code || `HTTP_${response.status}`;
      const errorMessage = data?.error?.message || response.statusText || 'API request failed';
      throw new ApiError(errorMessage, errorCode, response.status, data?.error?.details);
    }

    return data?.data !== undefined ? data.data : data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timeout: API server did not respond in time', 'TIMEOUT_ERROR', 408);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network connection failed', 'NETWORK_ERROR', 0);
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),

  /**
   * Safe fetch helper that returns fallback data if API is unavailable
   */
  getWithFallback: async (endpoint, fallbackData) => {
    try {
      return await apiClient.get(endpoint);
    } catch (err) {
      console.warn(`[ApiClient] Endpoint '${endpoint}' unavailable. Using prototype fallback data. Reason:`, err.message);
      return fallbackData;
    }
  },

  /**
   * Uploads multipart form data (e.g. evidence files)
   */
  upload: async (endpoint, formData, options = {}) => {
    const url = getApiUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);

    const uploadHeaders = { Accept: 'application/json' };
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('infrasync_prototype_auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.role) {
            uploadHeaders['x-user-role'] = parsed.role;
            uploadHeaders['x-user-id'] = parsed.userId || `usr-${parsed.role}`;
            uploadHeaders['Authorization'] = `Bearer demo-${parsed.role.replace('_', '-')}`;
          }
        }
      }
    } catch (e) {
      console.warn('[ApiClient] Failed to read auth header for upload:', e.message);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...uploadHeaders,
          ...options.headers,
        },
        body: formData, // browser automatically sets multipart boundary
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorCode = data?.error?.code || `HTTP_${response.status}`;
        const errorMessage = data?.error?.message || response.statusText || 'Upload failed';
        throw new ApiError(errorMessage, errorCode, response.status);
      }

      return data?.data !== undefined ? data.data : data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      throw new ApiError(err.message || 'Upload failed due to network error', 'UPLOAD_ERROR', 0);
    }
  },

  /**
   * Helper to construct evidence download URL
   */
  getEvidenceFileUrl: (evidenceId) => {
    return getApiUrl(`/evidence/${evidenceId}/file`);
  },

  /**
   * AI Service Endpoints (Phase 20-22)
   */
  getAiHealth: () => apiClient.get('/ai/health'),
  analyzeEvidence: (payload) => apiClient.post('/ai/analyze', payload),

  /**
   * Human Verification & Audit Workflow (Phase 23)
   */
  getVerifications: (projectId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.targetType) params.append('targetType', filters.targetType);
    if (filters.evidenceId) params.append('evidenceId', filters.evidenceId);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`/projects/${projectId}/verifications${queryString}`);
  },
  getVerificationById: (verificationId) => apiClient.get(`/verifications/${verificationId}`),
  verifyFinding: (payload) => apiClient.post('/verifications/verify', payload),
  rejectFinding: (payload) => apiClient.post('/verifications/reject', payload),
};

export default apiClient;



