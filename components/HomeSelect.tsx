import React from "react";
import { useRouter } from "next/router";

interface Props {
  onGoogle?: () => void;
  bgStyle?: React.CSSProperties;
}

const HomeSelect: React.FC<Props> = ({ onGoogle, bgStyle }) => {
  const router = useRouter();

  const handleGuest = () => {
    // Set guest mode and redirect to chat
    console.log("Guest button clicked!");
    // Add guest parameter and set credits for guest mode
    router.push("/menu?guest=1");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={bgStyle}
    >
      <div className="bg-white/80 rounded-3xl shadow-2xl px-8 py-10 w-full max-w-md mx-4 border border-blue-200 flex flex-col items-center relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold px-4 py-1 rounded-full shadow text-xs tracking-wider">
            MyKugy Beta
          </span>
        </div>

        {/* Logo dan judul */}
        <div className="w-32 h-32 mb-6 relative">
          <img
            src="https://raw.githubusercontent.com/Minatoz/myImages/main/logo1.png"
            alt="MyKugy Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Anime Chat</h1>
        <p className="text-gray-600 text-center mb-8">
          MyKugy
        </p>

        {/* Tombol Login */}
        <button
          className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg mb-4 hover:opacity-90 transition shadow"
          onClick={onGoogle}
          data-testid="google-button"
        >
          Daftar dengan Google
        </button>
        <button
          className="w-full py-3 rounded-lg font-semibold border-2 border-purple-400 text-purple-600 text-lg hover:bg-purple-50 transition shadow"
          onClick={handleGuest}
          data-testid="guest-button"
        >
          Mulai Sebagai Tamu
        </button>

        {/* Penjelasan kredit */}
        <div className="mt-7 w-full">
          <div className="flex items-center justify-center gap-2 text-xs text-blue-700/80 font-semibold mb-1">
            <svg width="20" height="20" fill="none" className="inline" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#a21caf" />
              <text x="12" y="16" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">G</text>
            </svg>
            <span>
              Login Google: <span className="font-bold text-purple-700">75 Kredit</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-blue-700/80 font-semibold">
            <svg width="20" height="20" fill="none" className="inline" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#0ea5e9" />
              <text x="12" y="16" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">T</text>
            </svg>
            <span>
              Mode Tamu: <span className="font-bold text-sky-500">20 Kredit</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Dibuat dengan ❤️ oleh MyKugy Team</p>
          <p className="mt-1">
            © 2024 MyKugy - v1.0.0 Beta
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeSelect;
