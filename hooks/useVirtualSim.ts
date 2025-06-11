import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { virtualSimService } from '../services/virtualSimService';
import { VirtualService, VirtualNumber, VirtualSimState } from '../types/virtualSim';

const TIMESTAMP = '2025-06-11 20:15:32';
const USER = 'lillysummer9794';

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

  const purchaseNumber = async (service: VirtualService) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await virtualSimService.purchaseNumber(service.service_id);
      
      if (response.status && response.data) {
        await loadActiveNumbers();
        return response.data;
      } else {
        throw new Error(response.error || 'Purchase failed');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Purchase failed',
        loading: false
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const checkNumberSMS = async (numberId: string) => {
    try {
      const response = await virtualSimService.checkSMS(numberId);
      return response.data?.messages || [];
    } catch (error) {
      console.error('Failed to check SMS:', error);
      return [];
    }
  };

  return {
    ...state,
    selectedCountry,
    setSelectedCountry,
    refreshServices: loadServices,
    loadActiveNumbers,
    purchaseNumber,
    checkNumberSMS
  };
};
