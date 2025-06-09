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
      // Sesuai dengan dokumentasi API
      const params = new URLSearchParams({
        api_key: this.apiKey,
        action: 'services',
        service: 'Whatsapp',
        country: country || '' // jika country tidak ada, kirim string kosong
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();
      
      // Response sesuai dokumentasi: { status: true, data: [...] }
      if (data.status === true && Array.isArray(data.data)) {
        return {
          status: true,
          data: data.data.map((service: any) => ({
            id: service.id,
            name: service.name,
            price: service.price,
            is_promo: service.is_promo === "1",
            tersedia: parseInt(service.tersedia),
            country: service.country,
            status: service.status === "1",
            category: service.category
          }))
        };
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return {
        status: false,
        data: {
          msg: 'Failed to load services'
        }
      };
    }
  }
}

export const virtuSimAPI = new VirtuSimAPI();
