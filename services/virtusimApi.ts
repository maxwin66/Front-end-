class VirtuSimAPI {
  async getServices(country?: string) {
    try {
      // Menggunakan API route Next.js
      const response = await fetch(`/api/virtusim?country=${country || ''}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

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
