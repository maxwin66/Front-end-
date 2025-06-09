class VirtuSimAPI {
  private apiKey: string;
  private baseUrl: string = 'https://virtusim.com/api/v2/json.php';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY || '';
  }

  async getServices(country?: string) {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        action: 'services',
        service: 'Whatsapp' // Bisa dijadikan parameter opsional jika perlu
      });

      if (country) {
        params.append('country', country);
      }

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();
      return data;

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
