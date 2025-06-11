import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useVirtualSim } from '../hooks/useVirtualSim';
import { VirtualService, VirtualNumber } from '../types/virtualSim';
import { toast } from 'react-hot-toast';

// Constants
const TIMESTAMP = '2025-06-11 19:38:53';
const USER = 'lillysummer9794';

const VirtualSims = () => {
  const router = useRouter();
  const [credits, setCredits] = useState(0);
  const [activeTab, setActiveTab] = useState<'services' | 'active'>('services');
  const {
    services,
    activeNumbers,
    loading,
    error,
    selectedCountry,
    setSelectedCountry,
    purchaseNumber,
    loadActiveNumbers,
    checkNumberSMS
  } = useVirtualSim();

  useEffect(() => {
    const checkAuth = () => {
      const email = localStorage.getItem('user_email');
      const token = sessionStorage.getItem('token');
      const storedCredits = localStorage.getItem('user_credits');
      
      if (!email || !token) {
        router.push('/');
        return;
      }

      if (storedCredits) {
        setCredits(parseInt(storedCredits));
      }
    };
    
    checkAuth();
    loadActiveNumbers();
  }, [router, loadActiveNumbers, TIMESTAMP]);

  const handlePurchase = async (service: VirtualService) => {
    try {
      if (credits < service.price) {
        toast.error('Insufficient credits');
        return;
      }

      const result = await purchaseNumber(service);
      if (result.data) {
        toast.success('Number purchased successfully!');
        setCredits(result.data.credits_left);
        localStorage.setItem('user_credits', String(result.data.credits_left));
        setActiveTab('active');
        loadActiveNumbers(); // Refresh active numbers
      } else {
        throw new Error(result.message || 'Purchase failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Purchase failed');
    }
  };

  const handleCheckSMS = async (numberId: string) => {
    try {
      const messages = await checkNumberSMS(numberId);
      if (messages.length > 0) {
        toast.success(`${messages.length} messages found`, {
          duration: 5000,
          position: 'top-center',
        });
        // TODO: Implement modal for message details
      } else {
        toast.info('No messages found');
      }
    } catch (error) {
      toast.error('Failed to check messages');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 bg-white shadow rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Virtual Number Services</h1>
              <p className="mt-1 text-sm text-gray-500">Available Credits: {credits}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/menu')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Menu
              </button>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="indonesia">Indonesia (WhatsApp)</option>
                <option value="united-states">United States (WhatsApp)</option>
                <option value="japan">Japan (WhatsApp)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'services'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Available Services
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Numbers
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500">{error}</div>
            </div>
          ) : activeTab === 'services' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.service_id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        service.is_premium
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {service.is_premium ? 'PREMIUM' : 'REGULAR'}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Price: {service.price_formatted}</p>
                      <p className="text-sm text-gray-500">Available: {service.available_numbers}</p>
                      {service.duration && (
                        <p className="text-sm text-gray-500">Duration: {service.duration}</p>
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <button
                      onClick={() => handlePurchase(service)}
                      disabled={service.status === 'unavailable' || credits < service.price || loading}
                      className={`w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        service.status === 'unavailable' || credits < service.price || loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : service.status === 'unavailable' 
                        ? 'Unavailable'
                        : credits < service.price
                          ? 'Insufficient Credits'
                          : 'Purchase Number'
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeNumbers.map((number) => (
                <div
                  key={number.id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{number.phone_number}</h3>
                    <p className="mt-1 text-sm text-gray-500">{number.service_name}</p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-500">
                        Status: <span className={number.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                          {number.status.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">Activated: {new Date(number.activation_date).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Expires: {new Date(number.expiry_date).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Messages Received: {number.sms_received}</p>
                    </div>
                    {number.status === 'active' && (
                      <button
                        onClick={() => handleCheckSMS(number.id)}
                        className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        Check Messages
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {activeNumbers.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No active numbers found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualSims;
