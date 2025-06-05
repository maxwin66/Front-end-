import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import ParticleEffect from './ParticleEffect';
import { UiContext } from "../pages/_app";

interface Props {
  onGoogle?: () => void;
  bgStyle?: React.CSSProperties;
}

const HomeSelect: React.FC<Props> = ({ onGoogle, bgStyle }) => {
  const router = useRouter();
  const { theme, darkMode, lang } = useContext(UiContext);
  const [showPremium, setShowPremium] = useState(false);

  const handleGuest = () => {
    router.push("/menu?guest=1");
  };

  // Tampilan awal yang simpel
  if (!showPremium) {
    return (
      <div 
        className="min-h-screen w-full relative"
        style={bgStyle}
      >
        {/* Language Selector */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button className="px-3 py-1 rounded-md bg-white/80 text-sm">
            Biru Langit
          </button>
          <button className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/80 text-sm">
            🇮🇩 Indonesia
          </button>
        </div>

        {/* Logo */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-32 h-32">
          <Image
            src="/logo.png"
            alt="MyKugy Logo"
            layout="fill"
            objectFit="contain"
            priority
            className="drop-shadow-lg"
          />
        </div>

        {/* Title Area */}
        <div className="absolute top-52 left-4 space-y-2">
          <div className="text-[#4785FF] text-lg">
            MyKugy AI Chat Anime
          </div>
          <div className="text-black/80 text-sm italic">
            "Jangan remehkan kekuatan impian" - Hatsuragi
          </div>
        </div>

        {/* Version and Links */}
        <div className="absolute top-72 left-4 space-y-1">
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

        {/* Start Button */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <button
            onClick={() => setShowPremium(true)}
            className={`px-12 py-3 rounded-full font-bold bg-gradient-to-r ${theme.gradient} text-white hover:scale-105 transition-all duration-300 shadow-xl`}
          >
            Mulai
          </button>
        </div>
      </div>
    );
  }

  // Tampilan premium setelah klik Mulai
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background dengan Parallax Effect */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          ...bgStyle,
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Particle Effect */}
      <ParticleEffect />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10 z-1" />

      {/* Light Beams Effect */}
      <div className="fixed inset-0 opacity-30 z-1">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => setShowPremium(false)}
        className="fixed top-4 left-4 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition"
      >
        ← Kembali
      </button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="relative group">
          {/* Card Background dengan animasi gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy blur-sm"></div>
          
          <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl px-8 py-10 w-full max-w-md">
            {/* Premium Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur"></div>
                <div className="relative px-6 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <span className="text-white text-sm font-semibold tracking-wide">
                    Premium Access
                  </span>
                </div>
              </div>
            </div>

            {/* Logo dengan efek glow */}
            <div className="relative w-32 h-32 mx-auto mb-8 group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur-md transition duration-500"></div>
              <div className="relative rounded-full overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="MyKugy Logo"
                  layout="fill"
                  objectFit="contain"
                  priority
                  className="transform group-hover:scale-110 transition duration-500"
                />
              </div>
            </div>

            {/* Login Buttons */}
            <div className="space-y-3">
              <button
                onClick={onGoogle}
                className="w-full py-3.5 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"/>
                  </svg>
                  {lang === 'jp' ? 'Google でログイン' :
                   lang === 'en' ? 'Sign in with Google' :
                   'Daftar dengan Google'}
                </div>
              </button>
              
              <button
                onClick={handleGuest}
                className="w-full py-3.5 rounded-xl font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {lang === 'jp' ? 'ゲストとして始める' :
                 lang === 'en' ? 'Start as Guest' :
                 'Mulai Sebagai Tamu'}
              </button>
            </div>

            {/* Credits Display */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold shadow-lg">G</span>
                  <span className="text-white text-sm">
                    75 {lang === 'jp' ? 'クレジット' :
                        lang === 'en' ? 'Credits' :
                        'Kredit'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold shadow-lg">T</span>
                  <span className="text-white text-sm">
                    20 {lang === 'jp' ? 'クレジット' :
                        lang === 'en' ? 'Credits' :
                        'Kredit'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSelect;
