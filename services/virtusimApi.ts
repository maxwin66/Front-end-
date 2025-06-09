class VirtuSimAPI {
  async getServices(country?: string) {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/virtusim?country=${country || ''}&_=${timestamp}`);

      if (!response.ok) {
        console.error('API Response not OK:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (data.status === true && Array.isArray(data.data)) {
        return {
          status: true,
          data: data.data
        };
      } else {
        console.error('Invalid response format:', data);
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
