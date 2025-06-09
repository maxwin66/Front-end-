import { useState, useEffect } from 'react';
import { VirtualService } from '../types/virtusim';
import { virtuSimAPI } from '../services/virtusimApi';

export function useVirtualServices(country: string) {
  const [services, setServices] = useState<VirtualService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await virtuSimAPI.getCountryServices(country);
        if (response.status === 200) {
          setServices(response.data);
          setError(null);
        } else {
          setError(response.error || 'Failed to load services');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [country]);

  return { services, loading, error };
}
