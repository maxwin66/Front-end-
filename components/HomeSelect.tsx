import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface Props {
  onGoogle: () => void;
  onGuest: () => void;
  bgStyle?: React.CSSProperties;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  local: string;
}

const LANGUAGES: Language[] = [
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', local: 'Indonesia' },
  { code: 'en', name: 'English', flag: '🇺🇸', local: 'English' },
  { code: 'jp', name: 'Japanese', flag: '🇯🇵', local: '日本語' }
];

const HomeSelect: React.FC<Props> = ({ onGoogle, onGuest, bgStyle }) => {
  const [theme, setTheme] = useState("light");
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(LANGUAGES[0]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLanguageSelect = (lang: Language) => {
    setCurrentLang(lang);
    setShowLanguages(false);
  };

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: theme === "dark" 
          ? "linear-gradient(135deg,#0f172a 40%,#172554 100%)"
          : "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Theme and Language Selectors */}
      <div className="fixed top-4 left-4 flex gap-2 z-10">
        <button 
          onClick={toggleTheme}
          className="px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm text-blue-900 text-sm font-medium hover:bg-white/90 transition"
        >
          {theme === "light" ? "Biru Langit" : "Mode Gelap"}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowLanguages(!showLanguages)}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm text-blue-900 text-sm font-medium hover:bg-white/90 transition"
          >
            <span className="text-lg" role="img" aria-label={`${currentLang.name} Flag`}>
              {currentLang.flag}
            </span>
            {currentLang.local}
          </button>

          {showLanguages && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white/95 backdrop-blur-sm rounded-md shadow-lg overflow-hidden">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 transition ${
                    currentLang.code === lang.code ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.local}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center Card */}
      <div className="h-screen flex items-center justify-center px-4">
        <div className={`${
          theme === "dark" 
            ? "bg-gray-800/95 text-white" 
            : "bg-white/95"
          } rounded-3xl shadow-2xl px-8 py-10 w-full max-w-md flex flex-col items-center relative backdrop-blur-md`}
        >
          {/* Beta Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-[#4785FF] text-white font-medium px-4 py-1 rounded-full text-xs">
              MyKugy Beta
            </span>
          </div>

          {/* Logo */}
          <div className="w-32 h-32 mb-4 relative">
            <Image
              src="/logo.png"
              alt="MyKugy Logo"
              width={128}
              height={128}
              priority
              className="object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/fallback-logo.png'; // Fallback image jika logo utama gagal load
                console.error('Error loading logo:', e);
              }}
            />
          </div>

          <h1 className={`text-2xl font-bold mb-1 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}>AI Anime Chat</h1>
          <p className={`text-sm mb-8 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            MyKugy
          </p>

          {/* Login Buttons */}
          <button
            onClick={onGoogle}
            className="w-full py-3 mb-3 rounded-lg font-medium bg-[#4785FF] text-white hover:opacity-90 transition"
          >
            {currentLang.code === 'jp' ? 'Google でログイン' :
             currentLang.code === 'en' ? 'Sign in with Google' :
             'Daftar dengan Google'}
          </button>
          <button
            onClick={onGuest}
            className="w-full py-3 rounded-lg font-medium border-2 border-[#4785FF] text-[#4785FF] hover:bg-blue-50 transition"
          >
            {currentLang.code === 'jp' ? 'ゲストとして始める' :
             currentLang.code === 'en' ? 'Start as Guest' :
             'Mulai Sebagai Tamu'}
          </button>

          {/* Credits Info */}
          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#4785FF] text-white font-bold">G</span>
              <span>
                {currentLang.code === 'jp' ? 'Googleログイン: ' :
                 currentLang.code === 'en' ? 'Google Login: ' :
                 'Login Google: '}
                <span className="font-semibold">75 
                  {currentLang.code === 'jp' ? 'クレジット' :
                   currentLang.code === 'en' ? 'Credits' :
                   'Kredit'}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#4785FF] text-white font-bold">T</span>
              <span>
                {currentLang.code === 'jp' ? 'ゲストモード: ' :
                 currentLang.code === 'en' ? 'Guest Mode: ' :
                 'Mode Tamu: '}
                <span className="font-semibold">25 
                  {currentLang.code === 'jp' ? 'クレジット' :
                   currentLang.code === 'en' ? 'Credits' :
                   'Kredit'}
                </span>
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className={`mt-8 text-center text-xs ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
            <p>
              {currentLang.code === 'jp' ? 'MyKugy Team により愛を込めて制作' :
               currentLang.code === 'en' ? 'Made with ❤️ by MyKugy Team' :
               'Dibuat dengan ❤️ oleh MyKugy Team'}
            </p>
            <p className="mt-1">© 2024 MyKugy - v1.0.0 Beta</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSelect;
