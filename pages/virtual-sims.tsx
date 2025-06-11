import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ServiceList } from '../components/ServiceList';
import { useVirtualSim } from '../hooks/useVirtualSim';
import { VirtualService } from '../types/virtualSim';

const TIMESTAMP = '2025-06-11 21:22:23';
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

  useEffect(() => {
    const savedCredits = localStorage.getItem('user_credits');
    if (savedCredits) {
      setCredits(parseInt(savedCredits));
    }
  }, []);

  const handleServiceSelect = async (service: VirtualService) => {
    try {
      if (service.price > credits) {
        toast.error('Insufficient credits!');
        return;
      }

      const loadingToast = toast.loading('Purchasing number...');

      const response = await purchaseNumber(service);
      toast.dismiss(loadingToast);

      if (response.status && response.data) {
        const newCredits = credits - service.price;
        setCredits(newCredits);
        localStorage.setItem('user_credits', String(newCredits));

        toast.success(`Successfully purchased number: ${response.data.phone_number}`);
        await loadActiveNumbers();
      } else {
        throw new Error(response.error || 'Failed to purchase number');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to purchase number');
    }
  };

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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-4 rounded-lg bg-red-50 p-6 text-center dark:bg-red-900 sm:mx-0">
          <p className="mb-4 text-red-800 dark:text-red-200">
            {error}
          </p>
          <button 
            onClick={() => {
              router.reload();
            }}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-700 dark:hover:bg-red-600"
          >
            <svg 
              className="mr-2 h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
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
