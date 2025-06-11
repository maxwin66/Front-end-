import { useEffect, useState } from 'react';
import { virtualSimService, VirtuSimResponse } from '../services/virtualSimService';
import { VirtualService } from '../types/virtualSim';

interface ServiceListProps {
  country?: string;
  onServiceSelect?: (service: VirtualService) => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({ 
  country = 'indonesia',
  onServiceSelect 
}) => {
  const [services, setServices] = useState<VirtualService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await virtualSimService.getServices(country);
        
        if (response.status && response.data) {
          setServices(response.data);
        } else {
          throw new Error(response.error || 'Failed to load services');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [country]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No services available for {country}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div
          key={service.service_id}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                service.is_premium
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {service.is_premium ? 'PREMIUM' : 'REGULAR'}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Price: {service.price_formatted}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available: {service.available_numbers}
              </p>
              {service.duration && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Duration: {service.duration}
                </p>
              )}
            </div>
          </div>
          <div className="px-4 py-4 sm:px-6">
            <button
              onClick={() => onServiceSelect?.(service)}
              disabled={service.status === 'unavailable'}
              className={`w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                ${service.status === 'unavailable'
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                } transition-colors duration-200`}
            >
              {service.status === 'unavailable' ? 'Unavailable' : 'Select Service'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
