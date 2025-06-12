import { VirtualService, VirtualNumber, VirtualSMSMessage } from '../types/virtualSim';

// Constants
const TIMESTAMP = '2025-06-11 21:57:05';
const USER = 'lillysummer9794';

export interface VirtuSimResponse<T> {
  status: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  user: string;
}

class VirtualSimService {
  // Menggunakan NEXT_PUBLIC_BACKEND_URL untuk base URL backend
  private readonly baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  // API key tidak lagi dibutuhkan di frontend karena backend yang akan menggunakannya
  // private readonly apiKey = process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY;
  private readonly timeout = 15000; // 15 detik timeout
  private readonly retryAttempts = 3;
  private readonly retryDelay = 1000; // 1 detik

  private async makeRequest<T>(
    endpoint: string, // Endpoint relatif ke backend, misal: '/api/virtusim/services'
    method: 'GET' | 'POST' = 'GET',
    params: Record<string, any> = {},
    attempt: number = 1
  ): Promise<VirtuSimResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      let url = `${this.baseUrl}${endpoint}`;
      let options: RequestInit = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal,
        cache: 'no-cache'
      };

      if (method === 'GET') {
        const queryParams = new URLSearchParams(params).toString();
        if (queryParams) {
          url = `${url}?${queryParams}`;
        }
      } else if (method === 'POST') {
        options.body = JSON.stringify(params);
      }

      const response = await fetch(url, options);

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Network error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Backend Anda sudah mengembalikan format { status: boolean, data: T, error?: string }
      // Jadi kita bisa langsung mengembalikan data tersebut
      return {
        ...data,
        timestamp: TIMESTAMP,
        user: USER
      };

    } catch (error) {
      console.error(`API Request Error (Attempt ${attempt}):`, error);

      if (attempt < this.retryAttempts) {
        console.log(`Retrying request (Attempt ${attempt + 1})...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        return this.makeRequest<T>(endpoint, method, params, attempt + 1);
      }

      return {
        status: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: TIMESTAMP,
        user: USER
      };
    }
  }

  // Account Endpoints
  async checkBalance(): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/balance');
  }

  async getBalanceLogs(): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/balance_logs');
  }

  async getRecentActivity(): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/recent_activity');
  }

  // Service Endpoints
  async getServices(country: string = 'indonesia', service: string = 'wa'): Promise<VirtuSimResponse<VirtualService[]>> {
    const response = await this.makeRequest<any[]>('/api/virtusim/services', 'GET', {
      country: country.toLowerCase(),
      service: service.toLowerCase()
    });

    // Transformasi data jika diperlukan, sesuaikan dengan struktur VirtualService
    if (response.status && Array.isArray(response.data)) {
      const transformedData: VirtualService[] = response.data.map(svc => ({
        service_id: svc.id || '',
        name: svc.name || 'Unknown Service',
        description: svc.description || '',
        country: svc.country || country.toLowerCase(),
        country_code: svc.country_code || country.toUpperCase().slice(0, 2),
        price: parseFloat(svc.price) || 0,
        price_formatted: this.formatPrice(svc.price),
        available_numbers: parseInt(svc.count) || 0, // Menggunakan 'count' dari backend
        status: svc.status?.toLowerCase() === 'available' ? 'available' : 'unavailable',
        duration: svc.duration || '30 minutes',
        category: svc.category || 'standard',
        is_premium: parseFloat(svc.price) > 10000 // Contoh logika premium
      }));

      return { ...response, data: transformedData };
    }

    return response;
  }

  async getCountries(): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/list_country');
  }

  async getOperators(country: string): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/list_operator', 'GET', { country });
  }

  // Transaction Endpoints
  async getActiveOrders(): Promise<VirtuSimResponse<VirtualNumber[]>> {
    const response = await this.makeRequest<any[]>('/api/virtusim/active_orders');

    // Transformasi data jika diperlukan, sesuaikan dengan struktur VirtualNumber
    if (response.status && Array.isArray(response.data)) {
      const transformedData: VirtualNumber[] = response.data.map(order => ({
        id: order.id || '',
        phone_number: order.number || order.phone_number || '',
        country_code: order.country || 'ID', // Sesuaikan jika backend memberikan kode negara
        status: order.status?.toLowerCase() || 'unknown', // Sesuaikan dengan status dari backend
        activation_date: order.activated_at || TIMESTAMP,
        expiry_date: order.expires_at || new Date(Date.now() + 30 * 60000).toISOString(),
        sms_received: parseInt(order.messages_count) || 0,
        service_name: order.service_name || 'Unknown Service'
      }));
      return { ...response, data: transformedData };
    }
    return response;
  }

  async purchaseNumber(serviceId: string, operator: string = 'any'): Promise<VirtuSimResponse<{ order_id: string; phone_number: string; credits_left: number; activation_time: string; expiry_time: string; }>> {
    const response = await this.makeRequest<any>('/api/virtusim/order', 'POST', {
      service: serviceId,
      operator: operator
    });

    if (response.status && response.data) {
      return {
        ...response,
        data: {
          order_id: response.data.id || '',
          phone_number: response.data.number || '', // Sesuaikan dengan key dari backend
          credits_left: parseInt(response.data.credits_left) || 0,
          activation_time: response.data.activation_time || TIMESTAMP, // Sesuaikan dengan key dari backend
          expiry_time: response.data.expiry_time || new Date(Date.now() + 30 * 60000).toISOString() // Sesuaikan dengan key dari backend
        }
      };
    }
    return response;
  }

  async reactiveOrder(orderId: string): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/reactive_order', 'POST', { id: orderId });
  }

  async checkOrderStatus(orderId: string): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/check_order', 'GET', { id: orderId });
  }

  async setOrderStatus(orderId: string, status: number): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/set_status', 'POST', { id: orderId, status });
  }

  async getOrderHistory(): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/order_history');
  }

  async getOrderDetail(orderId: string): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/detail_order', 'GET', { id: orderId });
  }

  async createDeposit(method: number, amount: number, phone: string): Promise<VirtuSimResponse<any>> {
    return this.makeRequest<any>('/api/virtusim/deposit', 'POST', { method, amount, phone });
  }

  // Helper methods
  public async fetcher<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'An error occurred');
    }
    const data = await response.json();
    // Assuming the backend always returns a structure like { status: boolean, data: T, error?: string }
    if (data.status === false) {
      throw new Error(data.error || 'An error occurred on the server');
    }
    return data.data; // Return the actual data part for SWR
  }

  private formatPrice(price: number | string): string {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(numericPrice || 0);
  }

  // validateResponse dan handleError tidak lagi diperlukan karena makeRequest sudah menanganinya
  // private validateResponse(response: any): boolean {
  //   return response && typeof response === 'object' && 'status' in response;
  // }

  // private handleError(error: unknown): VirtuSimResponse<never> {
  //   console.error('Service Error:', error);
  //   return {
  //     status: false,
  //     error: error instanceof Error ? error.message : 'Unknown error occurred',
  //     timestamp: TIMESTAMP,
  //     user: USER
  //   };
  // }
}

// Export instance
export const virtualSimService = new VirtualSimService();

      
