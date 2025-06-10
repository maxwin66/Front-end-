class VirtuSimAPI {
  private readonly API_URL = 'https://virtusim.com/api/v2/json.php';
  private readonly API_KEY = process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY;

  async getServices(country: string = 'Indonesia') {
    try {
      // Parameter sesuai dokumentasi Virtusim
      const params = new URLSearchParams({
        api_key: this.API_KEY || '',
        action: 'getServices',    // Method untuk get list service
        country: country,         // Filter by country
        status: 'all'            // Ambil semua status
      });

      const response = await fetch(`${this.API_URL}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      return {
        ...data,
        timestamp: "2025-06-10 23:23:09",
        user: "lillysummer9794"
      };

    } catch (error) {
      console.error('Error fetching services:', error);
      return {
        status: false,
        data: [],
        timestamp: "2025-06-10 23:23:09",
        user: "lillysummer9794"
      };
    }
  }
}

export const virtuSimAPI = new VirtuSimAPI();
