import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ServiceList } from '../components/ServiceList';
import { useVirtualSim } from '../hooks/useVirtualSim';
import { VirtualService } from '../types/virtualSim';

// Constants
const TIMESTAMP = '2025-06-11 20:48:03';
const USER = 'lillysummer9794';
const DEFAULT_CREDITS = 100000;

export default function VirtualSimsPage() {
  const router = useRouter();
  const [credits, setCredits] = useState<number>(DEFAULT_CREDITS);
  const { 
    services, 
    activeNumbers,
    loading, 
    error,
    purchaseNumber,
    loadActiveNumbers 
  } = useVirtualSim();

  // Load user credits from localStorage on mount
  useEffect(() => {
    const savedCredits = localStorage.getItem('user_credits');
    if (savedCredits) {
      setCredits(parseInt(savedCredits));
    }
  }, []);

  // Handle service selection and purchase
  const handleServiceSelect = async (service: VirtualService) => {
    try {
      // Check if user has enough credits
      if (service.price > credits) {
        toast.error('Insufficient credits!');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Purchasing number...');

      // Attempt to purchase number
      const response = await purchaseNumber(service);
      
      // Clear loading toast
      toast.dismiss(loadingToast);

      if (response.status && response.data) {
        // Success - update credits and show success message
        const newCredits = credits - service.price;
        setCredits(newCredits);
        localStorage.setItem('user_credits', String(newCredits));

        toast.success(`Successfully purchased number: ${response.data.phone_number}`);
        
        // Refresh active numbers list
        await loadActiveNumbers();
      } else {
        // Handle API error
        throw new Error(response.error || 'Failed to purchase number');
      }
    } catch (error) {
      // Handle any errors
      toast.error(error instanceof Error ? error.message : 'Failed to purchase number');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900">
          <p className="text-red-800 dark:text-red-200">
            Error: {error}
          </p>
          <button 
            onClick={() => router.reload()}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Virtual SIM Services
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Available Credits: {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(credits)}
          </p>
        </div>

        {/* Active Numbers Section */}
        {activeNumbers.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Active Numbers
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeNumbers.map((number) => (
                <div 
                  key={number.id}
                  className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                >
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {number.phone_number}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Service: {number.service_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expires: {new Date(number.expiry_date).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Messages: {number.sms_received}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services List */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Available Services
          </h2>
          <ServiceList onServiceSelect={handleServiceSelect} />
        </div>
      </div>
    </div>
  );
}
