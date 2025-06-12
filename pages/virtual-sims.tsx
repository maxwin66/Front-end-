import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ServiceList } from '../components/ServiceList';
import { useVirtualSim } from '../hooks/useVirtualSim';
import { VirtualService } from '../types/virtualSim';

const TIMESTAMP = '2025-06-11 21:57:05';
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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handlePurchase = async (serviceId: string, operator: string) => {
    if (credits <= 0) {
      toast.error('Not enough credits. Please top up.');
      return;
    }

    const result = await purchaseNumber(serviceId, operator);
    if (result && result.status) {
      toast.success(`Successfully purchased number: ${result.data.phone_number}`);
      setCredits(prev => prev - 1); // Deduct 1 credit per purchase
      localStorage.setItem('user_credits', (credits - 1).toString());
      loadActiveNumbers(); // Reload active numbers after purchase
    } else {
      toast.error(`Failed to purchase number: ${result?.error || 'Unknown error'}`);
    }
  };

  const handleCheckStatus = async (orderId: string) => {
    // Implement check status logic here
    toast(`Checking status for order: ${orderId}`);
  };

  const handleReactivate = async (orderId: string) => {
    // Implement reactivate logic here
    toast(`Reactivating order: ${orderId}`);
  };

  const handleCancel = async (orderId: string) => {
    // Implement cancel logic here
    toast(`Cancelling order: ${orderId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Virtual SIM Services</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Credits: Rp {credits.toLocaleString()}</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length > 0 ? (
            services.map((service: VirtualService) => (
              <div key={service.service_id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold">{service.name}</h3>
                <p>Price: Rp {service.price.toLocaleString()}</p>
                <p>Available: {service.available_numbers}</p>
                <p>Duration: {service.duration} minutes</p>
                {service.available_numbers > 0 ? (
                  <button
                    onClick={() => handlePurchase(service.service_id, 'any')}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Purchase
                  </button>
                ) : (
                  <button
                    className="mt-4 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                    disabled
                  >
                    Unavailable
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No services available at the moment.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Active Numbers</h2>
        {activeNumbers.length > 0 ? (
          activeNumbers.map((order: any) => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm mb-2">
              <p>Order ID: {order.id}</p>
              <p>Number: {order.number}</p>
              <p>Service: {order.service}</p>
              <p>Status: {order.status}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleCheckStatus(order.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Check Status
                </button>
                <button
                  onClick={() => handleReactivate(order.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Reactivate
                </button>
                <button
                  onClick={() => handleCancel(order.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No active numbers.</p>
        )}
      </div>
    </div>
  );
}

      
