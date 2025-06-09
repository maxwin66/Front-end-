export interface VirtualService {
  id: string;
  country: string;
  countryCode: string;
  application: string;
  type: 'PROMO' | 'REGULAR';
  rate: number;
  stock: number;
  status: 'available' | 'unavailable';
}

export interface UserState {
  login: string;
  balance: number;
  lastLogin: string;
}