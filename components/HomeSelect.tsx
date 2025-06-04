import React from "react";
import { useRouter } from "next/router";

interface Props {
  onGoogle?: () => void;
  bgStyle?: React.CSSProperties;
}

const HomeSelect: React.FC<Props> = ({ onGoogle, bgStyle }) => {
  const router = useRouter();

  const handleGuest = () => {
    // Debug log (opsional, bisa dihapus setelah yakin jalan)
    console.log("Guest button clicked!");
    router.push("/?openchat=1");
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

        <h1 className="text-3xl font-extrabold text-center mb-3 text-blue-700 drop-shadow-lg tracking-wide">
          AI Anime Chat <span className="text-purple-500">MyKugy</span>
        </h1>
        <p className="mb-7 text-gray-700 text-center text-lg font-medium">
          Temukan asisten AI karakter anime favoritmu.<br />Pilih mode untuk mulai!
        </p>

        <button
          className="w-full mb-4 py-3 rounded-lg font-semibold text-white text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition shadow-lg flex items-center justify-center gap-2"
          onClick={onGoogle}
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.6 20.5h-1.9v-.1H24v7.1h11.2c-1.2 3.2-4.1 5.4-7.2 5.4-4.3 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8c1.7 0 3.2.5 4.5 1.5l5.2-5.2C36.1 11.1 30.4 9 24 9c-8.3 0-15 6.7-15 15s6.7 15 15 15c7.5 0 13.7-5.4 14.9-12.5.1-.3.1-.6.1-.9.1-.6.1-1.2.1-1.8 0-.7 0-1.3-.1-1.9z"/></g></svg>
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
            <span className="mx-1">|</span>
            <svg width="20" height="20" fill="none" className="inline" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#64748b" />
              <text x="12" y="16" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">T</text>
            </svg>
            <span>
              Tamu: <span className="font-bold text-gray-700">20 Kredit</span>
            </span>
          </div>
        </div>

        {/* Quotes & info */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <span className="block mb-1 italic">
            “Impian itu bukan untuk dikejar, tapi untuk diwujudkan.”{" "}
            <span className="not-italic font-bold text-blue-500">- One Piece</span>
          </span>
          <span className="block">Kredit gratis untuk pengguna baru! 🚀</span>
        </div>
      </div>
    </div>
  );
};

export default HomeSelect;
