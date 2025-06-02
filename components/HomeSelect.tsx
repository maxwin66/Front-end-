import React from "react";

interface Props {
  onGoogle: () => void;
  onGuest: () => void;
  bgStyle?: React.CSSProperties;
}

const HomeSelect: React.FC<Props> = ({ onGoogle, onGuest, bgStyle }) => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={bgStyle}
  >
    <div className="bg-white/90 p-8 rounded-2xl max-w-sm w-full shadow-xl text-center">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Selamat Datang di MyKugy!</h1>
      <p className="mb-6 text-gray-700">
        Pilih mode untuk mulai menggunakan AI Chat Anime.
      </p>
      <button
        className="w-full mb-3 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-400 to-green-300 hover:from-blue-500 hover:to-green-400 transition"
        onClick={onGoogle}
      >
        Daftar dengan Google
      </button>
      <button
        className="w-full py-3 rounded-lg font-semibold border-2 border-blue-400 text-blue-500 hover:bg-blue-50 transition"
        onClick={onGuest}
      >
        Mulai sebagai Tamu
      </button>
    </div>
  </div>
);

export default HomeSelect;
