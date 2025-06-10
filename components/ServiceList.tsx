import { useState } from 'react';
import useVirtualServices from '../hooks/useVirtualServices'; // Perbaikan import

interface Service {
  id: string;
  application: string;
  country: string;
  countryCode: string;
  type: string;
  rate: number;
  stock: number;
  status: 'available' | 'unavailable';
}

interface ServiceListProps {
  selectedCountry: string;
  credits: number;
  onActivate?: (service: Service) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ selectedCountry, credits, onActivate }) => {
  const { services, loading, error } = useVirtualServices(selectedCountry);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No services available for {selectedCountry}
      </div>
    );
  }

  return (
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
              onClick={() => onActivate?.(service)}
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
  );
};

export default ServiceList;
