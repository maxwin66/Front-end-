import { VIRTUSIM_API } from '../config/api';

interface VirtuSimResponse {
  status: number;
  data?: any;
  error?: string;
}

class VirtuSimAPI {
  private apiKey: string;
  private baseUrl: string;
  private user: string;

  constructor() {
    this.apiKey = VIRTUSIM_API.KEY;
    this.baseUrl = VIRTUSIM_API.BASE_URL;
    this.user = 'lillysummer9794';
  }

  private getCurrentUTCTime() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  private async makeRequest(action: string, params: object = {}): Promise<VirtuSimResponse> {
    try {
      const requestTime = this.getCurrentUTCTime();
      console.log(`[${requestTime}] User ${this.user} - API Request: ${action}`);

      const url = new URL(this.baseUrl);
      const searchParams = new URLSearchParams({
        api_key: this.apiKey,
        action,
        ...params
      });

      const response = await fetch(`${url}?${searchParams}`);
      const data = await response.json();

      console.log(`[${this.getCurrentUTCTime()}] User ${this.user} - API Response:`, {
        action,
        status: response.status,
        success: !!data.success
      });

      return data;
    } catch (error) {
      console.error(`[${this.getCurrentUTCTime()}] User ${this.user} - API Error:`, {
        action,
        error
      });
      throw error;
    }
  }

  async getServices() {
    return this.makeRequest('getServices');
  }

  async getPrices() {
    return this.makeRequest('getPrices');
  }

  async getBalance() {
    return this.makeRequest('getBalance');
  }

  async getCountryServices(country: string) {
    return this.makeRequest('getServices', { country });
  }

  async getStatus(id: string) {
    return this.makeRequest('getStatus', { id });
  }
}

export const virtuSimAPI = new VirtuSimAPI();