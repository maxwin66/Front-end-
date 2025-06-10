class VirtuSimAPI {
  private getCurrentData() {
    return {
      timestamp: "2025-06-10 23:08:27",
      user: "lillysummer9794"
    };
  }

  async getServices(country?: string) {
    try {
      const response = await fetch(`/api/virtusim?country=${country || 'Indonesia'}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { timestamp, user } = this.getCurrentData();
      
      // Data produk tetap ada, hanya menambahkan timestamp dan user
      return {
        ...data,  // Semua data produk dari API tetap dipertahankan
        timestamp,
        user
      };

    } catch (error) {
      console.error('Service Error:', error);
      const { timestamp, user } = this.getCurrentData();
      
      return {
        status: false,
        data: [], // Kosong hanya jika ada error
        timestamp,
        user
      };
    }
  }
}

export const virtuSimAPI = new VirtuSimAPI();
