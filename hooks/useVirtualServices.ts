import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { virtualSimService } from '../services/virtualSimService';
import { VirtualService, VirtualNumber, VirtualSimState } from '../types/virtualSim';

export const useVirtualSim = (initialCountry = 'ID') => {
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
      
      if (response.status === 'success') {
        setState(prev => ({
          ...prev,
          services: response.data,
          loading: false
        }));
      } else {
        throw new Error(response.message || 'Failed to load services');
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
      if (response.status === 'success') {
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
      
      if (response.status === 'success' && response.data) {
        await loadActiveNumbers(); // Refresh active numbers
        if (response.data.credits_left) {
          localStorage.setItem('user_credits', String(response.data.credits_left));
        }
        return response.data;
      } else {
        throw new Error(response.message || 'Purchase failed');
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
      return response.data.messages;
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
