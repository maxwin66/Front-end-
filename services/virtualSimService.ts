// Constants
const TIMESTAMP = '2025-06-11 20:07:55';
const USER = 'lillysummer9794';

export interface Service {
  service_id: string;
  name: string;
  description: string;
  country: string;
  country_code: string;
  price: number;
  price_formatted: string;
  available_numbers: number;
  status: 'available' | 'unavailable';
  duration: string;
  category: string;
  is_premium: boolean;
}

export interface VirtuSimResponse<T> {
  status: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  user: string;
}

class VirtuSimAPI {
  private readonly baseUrl = 'https://virtusim.com/api/v2/json.php';
  private readonly apiKey = process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY;

  private async makeRequest<T>(action: string, params: Record<string, string> = {}): Promise<VirtuSimResponse<T>> {
    try {
      const queryParams = new URLSearchParams({
        api_key: this.apiKey || '',
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
      return {
        status: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: TIMESTAMP,
        user: USER
      };
    }
  }

  async getServices(country: string = 'indonesia'): Promise<VirtuSimResponse<Service[]>> {
    return this.makeRequest<Service[]>('services', { country, service: 'wa' });
  }

  async purchaseNumber(serviceId: string): Promise<VirtuSimResponse<{
    order_id: string;
    phone_number: string;
    credits_left: number;
    activation_time: string;
    expiry_time: string;
  }>> {
    return this.makeRequest('purchase', { id: serviceId });
  }

  async getActiveNumbers(): Promise<VirtuSimResponse<{
    id: string;
    phone_number: string;
    status: string;
    activation_date: string;
    expiry_date: string;
    sms_received: number;
    service_name: string;
  }[]>> {
    return this.makeRequest('numbers');
  }

  async checkSMS(numberId: string): Promise<VirtuSimResponse<{
    messages: Array<{
      id: string;
      text: string;
      sender: string;
      received_at: string;
    }>;
  }>> {
    return this.makeRequest('sms', { id: numberId });
  }
}

// Export instance
export const virtuSimAPI = new VirtuSimAPI();
