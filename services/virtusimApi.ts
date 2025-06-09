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
      // Pastikan format parameter sesuai dengan dokumentasi
      const params = new URLSearchParams({
        api_key: this.apiKey,
        action: 'services',
        service: 'Whatsapp',
        country: country || '' // Jika tidak ada country, kirim empty string
      });

      console.log('Request URL:', `${this.baseUrl}?${params}`); // Untuk debug

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Untuk debug

      // Pastikan format response sesuai
      if (data.status === true && Array.isArray(data.data)) {
        return {
          status: true,
          data: data.data
        };
      } else {
        throw new Error(data.data?.msg || 'Invalid response format');
      }

    } catch (error) {
      console.error('Failed to fetch services:', error);
      return {
        status: false,
        data: []
      };
    }
  }
}

export const virtuSimAPI = new VirtuSimAPI();
