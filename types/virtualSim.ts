export interface VirtualService {
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

export interface VirtualNumber {
  id: string;
  phone_number: string;
  country_code: string;
  status: string;
  activation_date: string;
  expiry_date: string;
  sms_received: number;
  service_name: string;
}

export interface VirtualSimState {
  services: VirtualService[];
  activeNumbers: VirtualNumber[];
  selectedService?: VirtualService;
  loading: boolean;
  error: string | null;
}

export interface VirtualSMSMessage {
  id: string;
  text: string;
  sender: string;
  received_at: string;
}
