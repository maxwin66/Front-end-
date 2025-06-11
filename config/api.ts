// Constants
export const CURRENT_TIMESTAMP = '2025-06-11 19:52:28';
export const CURRENT_USER = 'lillysummer9794';

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
