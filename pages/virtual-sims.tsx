// pages/virtual-sims.tsx
// Created: 2025-06-09
// Author: lillysummer9794
// Description: Virtual SIMs page for WANZ Store with WhatsApp and Discord contact options

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UiContext } from "./_app";

// Interface definitions
interface VirtualNumber {
  id: string;
  phoneNumber: string;
  provider: string;
  price: number;
  status: 'available' | 'purchased';
}

const VirtualSimsPage: React.FC = () => {
  const router = useRouter();
  const { darkMode } = useContext(UiContext);
  const [loading, setLoading] = useState(true);
  const [availableNumbers, setAvailableNumbers] = useState<VirtualNumber[]>([]);

  // Admin contact links - REPLACE THESE WITH YOUR ACTUAL LINKS
  const ADMIN_WA = "https://wa.me/+628xxxxxxxxx";
  const ADMIN_DISCORD = "https://discord.gg/yourdiscordinvite";

  useEffect(() => {
    const initPage = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }

        // Fetch available numbers
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/virtual-sims/available`);
        const data = await response.json();
        setAvailableNumbers(data.numbers || []);
      } catch (error) {
        console.error("Error fetching numbers:", error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  const handleContactAdmin = (number: VirtualNumber, platform: 'whatsapp' | 'discord') => {
    const message = `Halo Admin WANZ Store,\n\nSaya tertarik untuk membeli nomor virtual:\nNomor: ${number.phoneNumber}\nProvider: ${number.provider}\nHarga: Rp ${number.price.toLocaleString()}`;
    
    if (platform === 'whatsapp') {
      window.open(`${ADMIN_WA}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      window.open(ADMIN_DISCORD, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-500 to-purple-400 dark:from-slate-800 dark:to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-500 to-purple-400 dark:from-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-violet-800 dark:text-violet-400">
              Virtual SIMs
            </h1>
            <button
              onClick={() => router.push("/menu")}
              className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition text-sm"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>

        {/* Info Panel Section */}
        <div className="bg-white/90 dark:bg-slate-800/90 rounded-xl p-4 mb-8">
          <p className="text-center text-gray-600 dark:text-gray-300">
            Untuk pembelian nomor virtual, silakan hubungi admin melalui WhatsApp atau Discord
          </p>
        </div>

        {/* Available Numbers Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableNumbers.map((number) => (
            <div
              key={number.id}
              className="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {number.phoneNumber}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{number.provider}</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
                  Rp {number.price.toLocaleString()}
                </p>
              </div>
              
              {/* Contact Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => handleContactAdmin(number, 'whatsapp')}
                  className="w-full py-2 px-4 rounded-lg text-white bg-green-500 hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 15.32C16.46 15.82 15.74 16.32 15.24 16.42C14.74 16.52 14.14 16.57 13.54 16.37C13.14 16.22 12.64 16.07 11.94 15.72C9.94 14.72 8.64 12.72 8.54 12.62C8.44 12.52 7.54 11.32 7.54 10.02C7.54 8.72 8.14 8.17 8.39 7.87C8.64 7.57 8.94 7.52 9.14 7.52C9.34 7.52 9.54 7.52 9.74 7.52C9.94 7.52 10.24 7.47 10.44 8.02C10.64 8.57 11.19 9.87 11.24 9.97C11.29 10.07 11.34 10.22 11.24 10.37C10.54 11.87 9.84 11.77 10.24 12.42C11.74 14.92 13.24 15.32 14.04 15.62C14.34 15.72 14.64 15.67 14.84 15.52C15.04 15.37 15.44 14.87 15.64 14.62C15.84 14.37 16.04 14.42 16.34 14.52C16.64 14.62 17.94 15.22 18.24 15.37C18.54 15.52 18.74 15.57 18.84 15.72C18.84 15.97 18.84 16.52 18.64 16.92Z"/>
                  </svg>
                  Chat WhatsApp
                </button>
                
                <button
                  onClick={() => handleContactAdmin(number, 'discord')}
                  className="w-full py-2 px-4 rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
                  </svg>
                  Join Discord
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualSimsPage;
