import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import useVirtualServices from '../hooks/useVirtualServices';

const VirtualSims = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('ID');
  const [credits, setCredits] = useState(0);
  const { services, loading, error } = useVirtualServices(selectedCountry);

  // Only run on client-side
  useEffect(() => {
    setIsClient(true);
    const checkAuth = () => {
      const email = window?.localStorage?.getItem('user_email');
      const token = window?.sessionStorage?.getItem('token');
      const storedCredits = window?.localStorage?.getItem('user_credits');
      
      if (!email || !token) {
        router.push('/');
        return;
      }

      if (storedCredits) {
        setCredits(parseInt(storedCredits));
      }
    };
    
    checkAuth();
  }, [router]);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 bg-white shadow rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Virtual Number Services</h1>
              <p className="mt-1 text-sm text-gray-500">Available Credits: {credits}</p>
            </div>
            <button
              onClick={() => router.push('/menu')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Menu
            </button>
          </div>
        </div>

        {/* Country Selection */}
        <div className="mb-6 px-4 sm:px-0">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="ID">Indonesia</option>
            <option value="US">United States</option>
            <option value="JP">Japan</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        {/* Services Grid */}
        <div className="px-4 sm:px-0">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading services...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No services available for {selectedCountry}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{service.application}</h3>
                      <p className="mt-1 text-sm text-gray-500">{service.country}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      service.type === 'PREMIUM' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {service.type}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Rate: {service.rate} credits</p>
                    <p className="text-sm text-gray-500">Available: {service.stock}</p>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <button
                    disabled={service.status === 'unavailable' || credits < service.rate}
                    onClick={() => {/* Handle service activation */}}
                    className={`w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      service.status === 'unavailable' || credits < service.rate
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {service.status === 'unavailable' 
                      ? 'Unavailable'
                      : credits < service.rate
                        ? 'Insufficient Credits'
                        : 'Activate Service'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add getStaticProps to enable static generation
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default VirtualSims;
