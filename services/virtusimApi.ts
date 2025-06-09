class VirtuSimAPI {
  async getServices(country?: string) {
    try {
      const response = await fetch(`/api/virtusim?country=${country || 'Indonesia'}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Service Data:', data); // Debug log

      return data;

    } catch (error) {
      console.error('Service Error:', error);
      return {
        status: false,
        data: []
      };
    }
  }
}

export const virtuSimAPI = new VirtuSimAPI();
