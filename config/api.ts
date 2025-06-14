// Constants
export const CURRENT_TIMESTAMP = '2025-06-14 12:00:00';
export const CURRENT_USER = 'kugy_user';

// Backend API Configuration
export const BACKEND_API = {
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-cb98.onrender.com',
  ENDPOINTS: {
    CHAT: '/api/chat',
    MULTI_AGENT: '/api/multi-agent',
    IMAGE_GENERATION: '/api/generate-image',
    VIRTUAL_SIMS: '/api/virtusim',
    USER: '/api/user',
    CREDITS: '/api/credits',
    AUTH: '/auth',
    MULTI_AGENT_STATUS: '/multi-agent/status'
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// API Configurations
export const VIRTUSIM_API = {
  BASE_URL: 'https://virtusim.com/api/v2/json.php',
  KEY: process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY || '',
  DEFAULT_SERVICE: 'wa',
  DEFAULT_COUNTRY: 'indonesia',
  HEADERS: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
  }
};

// Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

// API Actions
export const VIRTUSIM_ACTIONS = {
  GET_SERVICES: 'services',
  PURCHASE: 'purchase',
  GET_NUMBERS: 'numbers',
  GET_SMS: 'sms'
} as const;

// Helper function untuk membuat URL dengan query params
export const createApiUrl = (action: string, params: Record<string, string> = {}) => {
  const queryParams = new URLSearchParams({
    api_key: VIRTUSIM_API.KEY,
    action,
    ...params
  });

  return `${VIRTUSIM_API.BASE_URL}?${queryParams.toString()}`;
};

// Helper function untuk menambahkan timestamp dan user ke response
export const addMetadata = <T extends object>(data: T) => {
  return {
    ...data,
    timestamp: CURRENT_TIMESTAMP,
    user: CURRENT_USER
  };
};

// Helper functions for Backend API calls
export const backendApiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BACKEND_API.BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: BACKEND_API.HEADERS,
    credentials: 'include',
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Specific API functions
export const multiAgentAPI = {
  processTask: async (task: string, useMultiAgent: boolean = true) => {
    return backendApiCall(BACKEND_API.ENDPOINTS.MULTI_AGENT, {
      method: 'POST',
      body: JSON.stringify({
        task,
        use_multi_agent: useMultiAgent
      })
    });
  },
  
  getStatus: async () => {
    return backendApiCall(BACKEND_API.ENDPOINTS.MULTI_AGENT_STATUS);
  }
};

export const userAPI = {
  getCurrentUser: async () => {
    return backendApiCall(BACKEND_API.ENDPOINTS.USER);
  },
  
  getCredits: async (userEmail?: string) => {
    const endpoint = userEmail 
      ? `${BACKEND_API.ENDPOINTS.CREDITS}?user_email=${encodeURIComponent(userEmail)}`
      : BACKEND_API.ENDPOINTS.CREDITS;
    return backendApiCall(endpoint);
  }
};

export const chatAPI = {
  sendMessage: async (message: string) => {
    return backendApiCall(BACKEND_API.ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
};
