import { useState, useEffect } from 'react';
import { virtuSimAPI } from '../services/virtusimApi';

export function useVirtualServices(country?: string) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await virtuSimAPI.getServices(country);
        if (response.status === 'success') {
          setServices(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [country]);

  return { services, loading, error };
}
