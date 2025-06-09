import { useState, useEffect } from 'react';
import { virtuSimAPI } from '../services/virtusimApi';
import { VirtualService } from '../types/virtusim';

export function useVirtusim() {
  const [services, setServices] = useState<VirtualService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await virtuSimAPI.getServices();
      
      if (response.status === 1) { // Success status dari API adalah 1
        setServices(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const orderService = async (serviceId: string, target?: string) => {
    try {
      const response = await virtuSimAPI.orderService({
        service: serviceId,
        target
      });
      return response;
    } catch (err) {
      return { status: 0, message: 'Order failed' };
    }
  };

  return {
    services,
    loading,
    error,
    orderService,
    refreshServices: loadServices
  };
}
