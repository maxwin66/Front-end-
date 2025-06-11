import { VirtualService, VirtualNumber, VirtualSMSMessage } from '../types/virtualSim';

// Constants
const TIMESTAMP = '2025-06-11 21:01:44';
const USER = 'lillysummer9794';

// Define response type once
export interface VirtuSimResponse<T> {
  status: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  user: string;
}

class VirtualSimService {
  private readonly baseUrl = 'https://virtusim.com/api/v2/json.php';
  private readonly apiKey = process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY;

  private async makeRequest<T>(action: string, params: Record<string, string> = {}): Promise<VirtuSimResponse<T>> {
    try {
      if (!this.apiKey) {
        throw new Error('API key not configured');
      }

      const queryParams = new URLSearchParams({
        api_key: this.apiKey,
        action,
        ...params
      });

      const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        ...data,
        timestamp: TIMESTAMP,
        user: USER
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        status: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: TIMESTAMP,
        user: USER
      };
    }
  }

  async getServices(country: string = 'indonesia'): Promise<VirtuSimResponse<VirtualService[]>> {
    const response = await this.makeRequest<any[]>('services', { 
      country: country.toLowerCase(),
      service: 'wa'
    });

    if (response.status && Array.isArray(response.data)) {
      const transformedData: VirtualService[] = response.data.map(service => ({
        service_id: service.id || '',
        name: service.name || 'Unknown Service',
        description: service.description || '',
        country: country.toLowerCase(),
        country_code: country.toUpperCase().slice(0, 2),
        price: parseFloat(service.price) || 0,
        price_formatted: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(parseFloat(service.price) || 0),
        available_numbers: parseInt(service.available) || 0,
        status: service.status?.toLowerCase() === 'available' ? 'available' : 'unavailable',
        duration: service.duration || '30 minutes',
        category: service.category || 'standard',
        is_premium: parseFloat(service.price) > 10000
      }));

      return {
        ...response,
        data: transformedData
      };
    }

    return response;
  }

  async purchaseNumber(serviceId: string): Promise<VirtuSimResponse<{
    order_id: string;
    phone_number: string;
    credits_left: number;
    activation_time: string;
    expiry_time: string;
  }>> {
    const response = await this.makeRequest<any>('purchase', { 
      id: serviceId 
    });

    if (response.status && response.data) {
      return {
        ...response,
        data: {
          order_id: response.data.id || '',
          phone_number: response.data.phone_number || '',
          credits_left: parseInt(response.data.credits_left) || 0,
          activation_time: TIMESTAMP,
          expiry_time: new Date(Date.now() + 30 * 60000).toISOString()
        }
      };
    }

    return response;
  }

  async getActiveNumbers(): Promise<VirtuSimResponse<VirtualNumber[]>> {
    const response = await this.makeRequest<any[]>('numbers');
    
    if (response.status && Array.isArray(response.data)) {
      const transformedData: VirtualNumber[] = response.data.map(number => ({
        id: number.id || '',
        phone_number: number.number || number.phone_number || '',
        country_code: number.country || 'ID',
        status: number.status?.toLowerCase() || 'expired',
        activation_date: number.activated_at || TIMESTAMP,
        expiry_date: number.expires_at || new Date(Date.now() + 30 * 60000).toISOString(),
        sms_received: parseInt(number.messages_count) || 0,
        service_name: number.service_name || 'WhatsApp'
      }));

      return {
        ...response,
        data: transformedData
      };
    }

    return response;
  }

  async checkSMS(numberId: string): Promise<VirtuSimResponse<{
    messages: VirtualSMSMessage[];
  }>> {
    const response = await this.makeRequest<any>('sms', { 
      id: numberId 
    });

    if (response.status && response.data?.messages) {
      const transformedMessages: VirtualSMSMessage[] = Array.isArray(response.data.messages) 
        ? response.data.messages.map((msg: any) => ({
            id: msg.id || '',
            text: msg.text || msg.content || '',
            sender: msg.sender || 'Unknown',
            received_at: msg.received_at || TIMESTAMP
          }))
        : [];

      return {
        ...response,
        data: {
          messages: transformedMessages
        }
      };
    }

    return {
      ...response,
      data: {
        messages: []
      }
    };
  }

  // Helper methods
  private formatPrice(price: number | string): string {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(numericPrice || 0);
  }

  private validateResponse(response: any): boolean {
    return response && typeof response === 'object' && 'status' in response;
  }

  private handleError(error: unknown): VirtuSimResponse<never> {
    console.error('Service Error:', error);
    return {
      status: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: TIMESTAMP,
      user: USER
    };
  }
}

// Export instance
export const virtualSimService = new VirtualSimService();
