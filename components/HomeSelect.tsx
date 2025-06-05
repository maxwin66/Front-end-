import React from "react";
import { useRouter } from "next/router";
import Image from "next/image"; // Tambahkan import Image dari Next.js

interface Props {
  onGoogle?: () => void;
  bgStyle?: React.CSSProperties;
}

const HomeSelect: React.FC<Props> = ({ onGoogle }) => {
  const router = useRouter();

  const handleGuest = () => {
    console.log("Guest button clicked!");
    router.push("/menu?guest=1");
  };

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Center Card */}
      <div className="h-screen flex items-center justify-center px-4">
        <div className="bg-white/95 rounded-3xl shadow-2xl px-8 py-10 w-full max-w-md flex flex-col items-center relative">
          {/* Beta Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-[#4785FF] text-white font-medium px-4 py-1 rounded-full text-xs">
              MyKugy Beta
            </span>
          </div>

          {/* Logo */}
          <div className="w-32 h-32 mb-4 relative"> {/* Sesuaikan ukuran jika perlu */}
            <Image
              src="/logo.png"
              alt="MyKugy Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1">AI Anime Chat</h1>
          <p className="text-gray-600 text-sm mb-8">
            MyKugy
          </p>

          {/* Login Buttons */}
          <button
            onClick={onGoogle}
            className="w-full py-3 mb-3 rounded-lg font-medium bg-[#4785FF] text-white hover:opacity-90 transition"
          >
            Daftar dengan Google
          </button>
          <button
            onClick={handleGuest}
            className="w-full py-3 rounded-lg font-medium border-2 border-[#4785FF] text-[#4785FF] hover:bg-blue-50 transition"
          >
            Mulai Sebagai Tamu
          </button>

          {/* Credits Info */}
          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#4785FF] text-white font-bold">G</span>
              <span>Login Google: <span className="font-semibold">75 Kredit</span></span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#4785FF] text-white font-bold">T</span>
              <span>Mode Tamu: <span className="font-semibold">20 Kredit</span></span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Dibuat dengan ❤️ oleh MyKugy Team</p>
            <p className="mt-1">© 2024 MyKugy - v1.0.0 Beta</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSelect;
