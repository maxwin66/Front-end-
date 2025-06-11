export interface VirtualService {
  service_id: string;
  name: string;
  description?: string;
  country: string;
  country_code: string;
  price: number;
  price_formatted: string;
  available_numbers: number;
  status: 'available' | 'unavailable';
  duration?: string;
  category: string;
  is_premium: boolean;
}

export interface VirtualNumber {
  id: string;
  phone_number: string;
  country_code: string;
  status: 'active' | 'expired';
  activation_date: string;
  expiry_date: string;
  sms_received: number;
  service_name: string;
}

export interface PurchaseResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    order_id: string;
    phone_number: string;
    credits_left: number;
    activation_time: string;
    expiry_time: string;
  };
  timestamp: string;
  user: string;
}

export interface ServiceListResponse {
  status: 'success' | 'error';
  message?: string;
  data: VirtualService[];
  timestamp: string;
  user: string;
}

export interface VirtualSimState {
  services: VirtualService[];
  activeNumbers: VirtualNumber[];
  selectedService?: VirtualService;
  loading: boolean;
  error: string | null;
}
