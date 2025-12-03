/**
 * API Client
 * Handles all API requests to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  constructor(baseURL = API_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
        throw new Error(error.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Brainrots endpoints
  async getBrainrots(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/brainrots${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getBrainrot(id) {
    return this.request(`/api/brainrots/${id}`);
  }

  async searchBrainrots(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/brainrots/search${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getCategories() {
    return this.request('/api/categories');
  }

  // Admin endpoints
  async triggerUpdate() {
    return this.request('/api/admin/update', { method: 'POST' });
  }

  async getUpdateStatus() {
    return this.request('/api/admin/status');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;

