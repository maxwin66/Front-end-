import { VIRTUSIM_API } from '../config/api';

class VirtuSimAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = VIRTUSIM_API.KEY;
    this.baseUrl = VIRTUSIM_API.BASE_URL;
  }

  async getServices(country?: string) {
    try {
      // Sesuai dengan format URL yang diberikan
      const params = new URLSearchParams({
        api_key: this.apiKey,
        action: 'services',
        service: 'Whatsapp'
      });

      // Tambahkan country jika ada
      if (country) {
        params.append('country', country);
      }

      const response = await fetch(`${this.baseUrl}?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return {
        status: 'error',
        message: 'Failed to fetch services'
      };
    }
  }
}

export const virtuSimAPI = new VirtuSimAPI();
