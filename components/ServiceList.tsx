import { useEffect, useState } from 'react';
import { virtuSimAPI } from '../services/virtualSimService';

interface Service {
  service_id: string;
  name: string;
  price: number;
  price_formatted: string;
  available_numbers: number;
  country: string;
  status: string;
}

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const result = await virtuSimAPI.getServices();
        
        if (result.status && Array.isArray(result.data)) {
          setServices(result.data);
        } else {
          setError('No services available');
        }
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) return <div>Loading services...</div>;
  if (error) return <div>{error}</div>;
  if (!services.length) return <div>No services available</div>;

  return (
    <div className="grid gap-4">
      {services.map((service) => (
        <div key={service.service_id} className="border p-4 rounded">
          <h3 className="font-bold">{service.name}</h3>
          <div>Price: {service.price_formatted}</div>
          <div>Available: {service.available_numbers}</div>
          <div>Country: {service.country}</div>
          <div>Status: {service.status}</div>
        </div>
      ))}
    </div>
  );
}
