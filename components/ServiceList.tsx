import { useEffect, useState } from 'react';
import { virtuSimAPI } from '../services/virtusimApi';

interface Service {
  id: string;
  name: string;
  price: number;
  available_numbers: number;
  status: string;
  country: string;
}

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
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

    fetchServices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!services.length) return <div>No services available</div>;

  return (
    <div className="grid gap-4 p-4">
      {services.map((service) => (
        <div key={service.id} className="border p-4 rounded">
          <h3 className="font-bold">{service.name}</h3>
          <p>Country: {service.country}</p>
          <p>Price: {service.price}</p>
          <p>Available: {service.available_numbers}</p>
          <p>Status: {service.status}</p>
        </div>
      ))}
    </div>
  );
}
