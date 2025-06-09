import { useState } from 'react';
import { useVirtualServices } from '../hooks/useVirtualServices';

interface Service {
  id: string;
  name: string;
  price: string;
  is_promo: string;
  tersedia: string;
  country: string;
  status: string;
  category: string;
}

export default function ServiceList() {
  const [country, setCountry] = useState('Indonesia');
  const { services, loading, error } = useVirtualServices(country);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4">
        <div>
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Indonesia">Indonesia</option>
            <option value="Russia">Russia</option>
          </select>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            Show
            <select className="mx-2 border p-1 rounded">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            entries
          </div>
          
          <div className="flex items-center">
            Search:
            <input 
              type="text" 
              className="ml-2 border p-1 rounded" 
              placeholder="What"
            />
          </div>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No services available
        </div>
      ) : (
        <div className="divide-y">
          {services.map((service: Service) => (
            <div key={service.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img 
                    src={`/icons/${service.name.toLowerCase()}.png`}
                    alt={service.name}
                    className="w-8 h-8"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = '/icons/default.png';
                    }}
                  />
                  <div>
                    <div className="font-medium">
                      {service.name}
                      {service.is_promo === "1" && (
                        <span className="ml-2 text-orange-500">🔥 PROMO</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {service.country}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">Rate</div>
                  <div className="text-emerald-500 font-medium">
                    Buy from {parseInt(service.price).toLocaleString()} IDR
                  </div>
                  <div className="text-sm text-gray-600">
                    Stock: {parseInt(service.tersedia).toLocaleString()} Pcs
                  </div>
                  <button 
                    className={`mt-2 px-4 py-1 rounded transition-colors ${
                      service.status === "1"
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={service.status !== "1"}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 text-sm text-gray-600">
        Showing {services.length} of {services.length} entries
      </div>
    </div>
  );
}
