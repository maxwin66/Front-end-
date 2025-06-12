import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { virtualSimService } from '../services/virtualSimService'; // Import the corrected service
import { VirtualService, VirtualNumber, VirtualSimState } from '../types/virtualSim';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

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
  const [state, setState] = useState<VirtualSimState>({
    services: [],
    activeNumbers: [],
    loading: true,
    error: null,
  });

  // Fetch available services
  const { data: servicesData, error: servicesError, isLoading: servicesLoading } = useSWR(
    `${API_BASE_URL}/api/virtusim/services?country=${initialCountry}&service=wa`,
    virtualSimService.fetcher // Use the fetcher from virtualSimService
  );

  // Fetch active numbers
  const { data: activeNumbersData, error: activeNumbersError, isLoading: activeNumbersLoading, mutate: mutateActiveNumbers } = useSWR(
    `${API_BASE_URL}/api/virtusim/active_orders`,
    virtualSimService.fetcher // Use the fetcher from virtualSimService
  );

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      services: servicesData?.data || [], // Assuming backend returns data directly under 'data' key
      activeNumbers: activeNumbersData?.data || [], // Assuming backend returns data directly under 'data' key
      loading: servicesLoading || activeNumbersLoading,
      error: servicesError?.message || activeNumbersError?.message || null,
    }));
  }, [servicesData, servicesError, servicesLoading, activeNumbersData, activeNumbersError, activeNumbersLoading]);

  const purchaseNumber = async (serviceId: string, operator: string): Promise<PurchaseResponse> => {
    try {
      const result = await virtualSimService.purchaseNumber(serviceId, operator);
      if (result.status) {
        mutateActiveNumbers(); // Revalidate active numbers after purchase
        return { status: true, data: result.data };
      } else {
        throw new Error(result.error || 'Failed to purchase number');
      }
    } catch (err: any) {
      return { status: false, error: err.message };
    }
  };

  const loadActiveNumbers = () => {
    mutateActiveNumbers();
  };

  // Implement other actions like checkOrderStatus, reactiveOrder, setOrderStatus, etc.
  // by calling virtualSimService methods directly.

  return {
    services: state.services,
    activeNumbers: state.activeNumbers,
    loading: state.loading,
    error: state.error,
    purchaseNumber,
    loadActiveNumbers,
    // Add other functions here as needed
  };
};

