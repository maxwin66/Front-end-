import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-cb98.onrender.com";

export interface VirtualService {
  id: string;
  application: string;
  country: string;
  countryCode: string;
  type: string;
  rate: number;
  stock: number;
  status: 'available' | 'unavailable';
  description?: string;
  duration?: string;
  price_formatted?: string;
}

const useVirtualServices = (country: string) => {
  const [services, setServices] = useState<VirtualService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (typeof window === 'undefined') return;

        const email = window.localStorage.getItem('user_email');
        const token = window.sessionStorage.getItem('token');

        if (!email || !token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${BACKEND_URL}/api/virtusim/services?country=${encodeURIComponent(country)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        const data = await response.json();

        if (response.ok && data.status === 'success' && Array.isArray(data.data)) {
          const transformedServices = data.data.map((service: any) => ({
            id: service.service_id,
            application: service.name,
            description: service.description,
            country: service.country,
            countryCode: country.slice(0, 2).toUpperCase(),
            type: parseFloat(service.price) > 10000 ? 'PREMIUM' : 'REGULAR',
            rate: parseFloat(service.price),
            stock: service.available_numbers,
            status: service.status.toLowerCase() === 'available' ? 'available' : 'unavailable',
            duration: service.duration,
            price_formatted: service.price_formatted
          }));
          
          setServices(transformedServices);
          setError(null);
        } else {
          setError(data.message || 'No services available for this country at the moment');
          setServices([]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Network error');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [country]);

  return { services, loading, error };
};

export default useVirtualServices;
