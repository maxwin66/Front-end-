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
        
        // Jika ada data, set services
        if (response.data) {
          setServices(response.data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        // Jangan tampilkan error ke user
        setServices([]); // Set empty array instead of showing error
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [country]);

  // Return empty array instead of error
  return { services, loading, error: null };
}
