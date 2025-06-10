import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useVirtualServices } from '../hooks/useVirtualServices';

const VirtualSimsPage: React.FC = () => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('Indonesia');
  const [serviceType, setServiceType] = useState<'single' | 'multiple'>('single');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [credits, setCredits] = useState<number>(0);

  const { services, loading, error } = useVirtualServices(selectedCountry);

  // Get current UTC time
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const currentUser = localStorage.getItem('user_email') || 'Guest';

  useEffect(() => {
    const checkAuth = async () => {
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
  }, [router]);

  const handlePurchase = async (serviceId: string, price: number) => {
    if (credits < 25) {
      alert('Insufficient credits. Minimum 25 credits required.');
      return;
    }

    try {
      const email = localStorage.getItem('user_email');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/virtusim/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: selectedCountry,
          service_id: serviceId,
          user_email: email
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Show contact info modal
        alert(`Please contact admin to complete your purchase:\nWhatsApp: ${data.contact.whatsapp}\nDiscord: ${data.contact.discord}`);
      } else {
        alert(data.message || 'Failed to process purchase');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to process purchase. Please try again.');
    }
  };

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
        {/* Credits Display */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <span className="text-blue-600 font-medium">Available Credits: {credits}</span>
        </div>

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
            <option value="Russia">🇷🇺 Russia</option>
            <option value="Vietnam">🇻🇳 Vietnam</option>
            <option value="Kazakhstan">🇰🇿 Kazakhstan</option>
            <option value="Ukraine">🇺🇦 Ukraine</option>
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
              placeholder="Search services..."
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
              <h3 className="font-semibold">Available Services</h3>
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
                        onError={(e) => {
                          e.currentTarget.src = '/icons/default.png';
                        }}
                      />
                      <div>
                        <div className="font-medium">
                          {service.application}
                          {service.type === 'PREMIUM' && (
                            <span className="ml-2 text-orange-500">🔥 PREMIUM</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{service.country}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600">Rate</div>
                      <div className="text-emerald-500 font-medium">
                        Rp {service.rate.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Stock: {service.stock} numbers
                      </div>
                      <button 
                        onClick={() => handlePurchase(service.id, service.rate)}
                        className={`mt-2 px-4 py-1 rounded transition-colors ${
                          service.status === 'available'
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={service.status === 'unavailable'}
                      >
                        {service.status === 'available' ? 'Buy Now' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            <div className="p-4 text-sm text-gray-600">
              Showing 1 to {Math.min(entriesPerPage, services.length)} of {services.length} entries
              {searchQuery && services.length > 0 && ` (filtered from ${services.length} total entries)`}
            </div>
          </div>
        )}

        {/* Back to Menu Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/menu')}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualSimsPage;
