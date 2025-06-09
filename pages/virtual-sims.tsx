import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useVirtualServices } from '../hooks/useVirtualServices';

const VirtualSimsPage: React.FC = () => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('Indonesia');
  const [serviceType, setServiceType] = useState<'single' | 'multiple'>('single');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { services, loading, error } = useVirtualServices(selectedCountry);

  // Get current UTC time
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const currentUser = 'lillysummer9794';

  return (
    <div className="min-h-screen bg-white">
      {/* Header with UTC time and user info */}
      <div className="bg-gray-100 p-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Current Date and Time (UTC): {currentTime}
          </div>
          <div className="text-sm text-gray-600">
            Current User's Login: {currentUser}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Service Type Selection */}
        <div className="flex gap-4">
          <button
            onClick={() => setServiceType('single')}
            className={`px-6 py-2 rounded-lg ${
              serviceType === 'single' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600'
            }`}
          >
            Single Service
          </button>
          <button
            onClick={() => setServiceType('multiple')}
            className={`px-6 py-2 rounded-lg ${
              serviceType === 'multiple' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600'
            }`}
          >
            Multiple Service
          </button>
        </div>

        {/* Country Selection */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Choose Country:
          </label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Indonesia">🇮🇩 Indonesia</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What"
              className="border rounded px-3 py-1"
            />
          </div>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-semibold">Aplikasi</h3>
            </div>
            
            {services
              .filter(service =>
                service.application.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.country.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, entriesPerPage)
              .map((service) => (
                <div key={service.id} className="p-4 border-b hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img 
                        src={`/icons/${service.application.toLowerCase()}.png`}
                        alt={service.application}
                        className="w-8 h-8"
                      />
                      <div>
                        <div className="font-medium">
                          {service.application}
                          {service.type === 'PROMO' && (
                            <span className="ml-2 text-orange-500">🔥 PROMO</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <img 
                            src={`/flags/${service.countryCode.toLowerCase()}.png`}
                            alt={service.country}
                            className="w-4 h-4"
                          />
                          {service.country}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600">Rate</div>
                      <div className="text-emerald-500 font-medium">
                        Buy from {service.rate.toLocaleString()} IDR
                      </div>
                      <div className="text-sm text-gray-600">
                        Stok: {service.stock.toLocaleString()} Pcs
                      </div>
                      <button 
                        className="mt-2 bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 transition-colors"
                        disabled={service.status === 'unavailable'}
                      >
                        Beli
                      </button>
                    </div>
                  </div>
                </div>
            ))}

            <div className="p-4 text-sm text-gray-600">
              Showing 1 to {Math.min(entriesPerPage, services.length)} of {services.length} entries
              {services.length > services.length && ` (filtered from ${services.length})`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualSimsPage;
