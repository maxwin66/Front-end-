import { useState, useEffect } from 'react';
import { virtuSimAPI } from '../services/virtusimApi';

export function useVirtualServices(country?: string) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await virtuSimAPI.getServices(country);
        
        if (response.status === true && Array.isArray(response.data)) {
          setServices(response.data);
          setError(null);
        } else {
          setServices([]);
          setError('Failed to load services');
        }
      } catch (err) {
        console.error('Error in useVirtualServices:', err);
        setServices([]);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [country]);

  return { services, loading, error };
}
