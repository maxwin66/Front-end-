import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { UiContext } from "../pages/_app";

interface Props {
  onGoogle?: () => void;
  bgStyle?: React.CSSProperties;
}

const HomeSelect: React.FC<Props> = ({ onGoogle, bgStyle }) => {
  const router = useRouter();
  const { theme, lang } = useContext(UiContext);

  const handleGuest = () => {
    console.log("Guest button clicked!");
    router.push("/menu?guest=1");
  };

  return (
    <div 
      className="min-h-screen w-full relative"
      style={bgStyle}
    >
      {/* Beta Badge */}
      <div className="absolute top-2 left-4">
        <span className="bg-blue-50 text-xs px-2 py-0.5 rounded font-medium">
          Biru Langit
        </span>
      </div>

      {/* Language Selector */}
      <div className="absolute top-2 right-4">
        <span className="bg-blue-50 text-xs px-2 py-0.5 rounded font-medium">
          🇮🇩 Indonesia
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-start px-4 pt-16">
        {/* Title */}
        <h1 className="text-[#4785FF] text-lg">
          MyKugy AI Chat Anime
        </h1>

        {/* Quote */}
        <p className="text-black/80 text-sm italic mt-1">
          "Jangan remehkan kekuatan impian" - Hatsuragi
        </p>

        {/* Version & Links */}
        <div className="mt-4 space-y-1">
          <div className="text-black/80">
            Versi v1.0.0 Beta | <a href="#" className="text-[#4785FF]">Instagram</a> | <a href="#" className="text-[#4785FF]">Discord</a>
          </div>
          <div className="text-black/80">
            Artwork by AI | <a href="#" className="text-[#4785FF]">Kebijakan Privasi</a>
          </div>
          <div className="text-black/80">
            Dikembangkan dengan ❤️ oleh Eichiro
          </div>
        </div>

        {/* Login/Guest Buttons */}
        <div className="fixed bottom-20 left-0 right-0 flex flex-col items-center gap-3 px-4">
          <button
            onClick={onGoogle}
            className="w-full max-w-xs py-3 rounded-full font-medium bg-[#4785FF] text-white"
          >
            Daftar dengan Google
          </button>
          
          <button
            onClick={handleGuest}
            className="w-full max-w-xs py-3 rounded-full font-medium border border-[#4785FF] text-[#4785FF]"
          >
            Mulai Sebagai Tamu
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeSelect;
