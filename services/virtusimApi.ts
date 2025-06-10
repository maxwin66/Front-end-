class VirtuSimAPI {
  private readonly apiUrl = '/api/virtusim/services';

  async getServices() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Service data:', data);
      
      return data;

    } catch (error) {
      console.error('Service fetch error:', error);
      return {
        status: false,
        data: [],
        timestamp: '2025-06-10 23:47:44',
        user: 'lillysummer9794'
      };
    }
  }
}

export const virtuSimAPI = new VirtuSimAPI();
