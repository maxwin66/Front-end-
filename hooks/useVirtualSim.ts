import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { virtualSimService } from '../services/virtualSimService';
import { VirtualService, VirtualNumber, VirtualSimState } from '../types/virtualSim';

const TIMESTAMP = '2025-06-11 20:54:48';
const USER = 'lillysummer9794';

interface PurchaseResponse {
  status: boolean;
  data?: {
    order_id: string;
    phone_number: string;
    credits_left: number;
    activation_time: string;
    expiry_time: string;
  };
  error?: string;
  timestamp: string;
  user: string;
}

export const useVirtualSim = (initialCountry = 'indonesia') => {
  const router = useRouter();
  const [state, setState] = useState<VirtualSimState>({
    services: [],
    activeNumbers: [],
    loading: true,
    error: null
  });
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  useEffect(() => {
    loadServices();
  }, [selectedCountry]);

  const loadServices = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await virtualSimService.getServices(selectedCountry);
      
      if (response.status && response.data) {
        setState(prev => ({
          ...prev,
          services: response.data,
          loading: false
        }));
      } else {
        throw new Error(response.error || 'Failed to load services');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false
      }));
    }
  };

  const loadActiveNumbers = async () => {
    try {
      const response = await virtualSimService.getActiveNumbers();
      if (response.status && response.data) {
        setState(prev => ({ ...prev, activeNumbers: response.data }));
      }
    } catch (error) {
      console.error('Failed to load active numbers:', error);
    }
  };

  const purchaseNumber = async (service: VirtualService): Promise<PurchaseResponse> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await virtualSimService.purchaseNumber(service.service_id);
      
      if (response.status && response.data) {
        await loadActiveNumbers();
        return response;
      } else {
        throw new Error(response.error || 'Purchase failed');
      }
    } catch (error) {
      const errorResponse: PurchaseResponse = {
        status: false,
        error: error instanceof Error ? error.message : 'Purchase failed',
        timestamp: TIMESTAMP,
        user: USER
      };
      setState(prev => ({
        ...prev,
        error: errorResponse.error,
        loading: false
      }));
      return errorResponse;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    ...state,
    selectedCountry,
    setSelectedCountry,
    refreshServices: loadServices,
    loadActiveNumbers,
    purchaseNumber
  };
};
