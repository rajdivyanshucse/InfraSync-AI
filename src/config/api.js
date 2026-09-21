/**
 * InfraSync AI — Frontend API Configuration
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  PREFIX: import.meta.env.VITE_API_PREFIX || '/api',
  TIMEOUT_MS: 10000,
};

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}${cleanEndpoint}`;
};
