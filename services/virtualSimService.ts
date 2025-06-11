import { VirtualService, VirtualNumber, PurchaseResponse, ServiceListResponse } from '../types/virtualSim';
import { getCurrentTimestamp, getCurrentUser } from '../utils/dateUtils';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-cb98.onrender.com";

export class VirtualSimService {
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = sessionStorage.getItem('token');
    const email = localStorage.getItem('user_email');

    if (!token || !email) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network error');
    }

    return response.json();
  }

  async getServices(country: string): Promise<ServiceListResponse> {
    const response = await this.fetchWithAuth(`/api/virtusim/services?country=${encodeURIComponent(country)}`);
    return {
      ...response,
      timestamp: getCurrentTimestamp(),
      user: getCurrentUser()
    };
  }

  async getActiveNumbers(): Promise<{ 
    status: string; 
    data: VirtualNumber[];
    timestamp: string;
    user: string;
  }> {
    const response = await this.fetchWithAuth('/api/virtusim/numbers');
    return {
      ...response,
      timestamp: getCurrentTimestamp(),
      user: getCurrentUser()
    };
  }

  async purchaseNumber(serviceId: string): Promise<PurchaseResponse> {
    const response = await this.fetchWithAuth('/api/virtusim/purchase', {
      method: 'GET',
      body: JSON.stringify({ service_id: serviceId }),
    });
    return {
      ...response,
      timestamp: getCurrentTimestamp(),
      user: getCurrentUser()
    };
  }

  async checkSMS(numberId: string): Promise<{
    status: string;
    data: {
      messages: Array<{
        id: string;
        text: string;
        sender: string;
        received_at: string;
      }>;
    };
    timestamp: string;
    user: string;
  }> {
    const response = await this.fetchWithAuth(`/api/virtusim/sms/${numberId}`);
    return {
      ...response,
      timestamp: getCurrentTimestamp(),
      user: getCurrentUser()
    };
  }
}

export const virtualSimService = new VirtualSimService();
