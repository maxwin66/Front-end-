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

        // Debug info
        alert(`Debug Info:
Email: ${email}
Token: ${token?.substring(0, 10)}...
Country: ${country}`);

        if (!email || !token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${BACKEND_URL}/api/virtusim/services?country=${encodeURIComponent(country)}&email=${encodeURIComponent(email)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        const data = await response.json();
        
        // Debug response
        alert(`API Response:
Status: ${response.status}
OK: ${response.ok}
Data: ${JSON.stringify(data, null, 2)}`);

        if (response.ok && data.status === 'success') {
          const transformedServices = data.data.map((service: any) => ({
            id: service.service_id,
            application: service.name,
            country: service.country,
            countryCode: service.country.slice(0, 2).toUpperCase(),
            type: service.price > 10000 ? 'PREMIUM' : 'REGULAR',
            rate: parseFloat(service.price),
            stock: service.available_numbers,
            status: service.status.toLowerCase() === 'available' ? 'available' : 'unavailable'
          }));
          
          // Debug transformed data
          alert(`Transformed Services:
Count: ${transformedServices.length}
First Service: ${JSON.stringify(transformedServices[0], null, 2)}`);
          
          setServices(transformedServices);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch services');
          setServices([]);
        }
      } catch (error) {
        alert(`Error: ${error}`);
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
