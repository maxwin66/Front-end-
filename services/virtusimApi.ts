class VirtuSimAPI {
  async getServices(country: string = 'Russia', service: string = '') {
    try {
      // Gunakan Next.js API route
      const response = await fetch(`/api/virtusim/services?country=${country}&service=${service}`);
      
      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return {
        ...data,
        timestamp: "2025-06-10 23:34:34",
        user: "lillysummer9794"
      };

    } catch (error) {
      console.error('Error:', error);
      return {
        status: false,
        data: [],
        timestamp: "2025-06-10 23:34:34",
        user: "lillysummer9794"
      };
    }
  }
}

export const virtuSimAPI = new VirtuSimAPI();
