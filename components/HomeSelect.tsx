import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import ParticleEffect from './ParticleEffect';

interface Props {
  onGoogle?: () => void;
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

const HomeSelect: React.FC<Props> = ({ onGoogle }) => {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(LANGUAGES[0]);

  const handleGuest = () => {
    console.log("Guest button clicked!");
    router.push("/menu?guest=1");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLanguageSelect = (lang: Language) => {
    setCurrentLang(lang);
    setShowLanguages(false);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background with Parallax Effect */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png')",
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

      {/* Content */}
      <div className="relative z-10">
        {/* Premium Glass Navbar */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            {/* Theme and Language Selectors */}
            <div className="flex gap-3">
              <button 
                onClick={toggleTheme}
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                {theme === "light" ? (
                  <>
                    <span role="img" aria-label="Light Mode">🌤️</span>
                    <span className="hidden sm:inline">Biru Langit</span>
                  </>
                ) : (
                  <>
                    <span role="img" aria-label="Dark Mode">🌙</span>
                    <span className="hidden sm:inline">Mode Gelap</span>
                  </>
                )}
              </button>

              {/* Language Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowLanguages(!showLanguages)}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <span className="text-lg">{currentLang.flag}</span>
                  <span className="hidden sm:inline">{currentLang.local}</span>
                </button>

                {showLanguages && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden transform transition-all duration-300 shadow-xl">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/20 transition-all duration-300 ${
                          currentLang.code === lang.code ? 'bg-white/20' : ''
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

            {/* Version Badge */}
            <div className="flex items-center">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
                v1.0.0 Beta
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="relative group">
            {/* Animated Border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy blur-sm"></div>
            
            {/* Main Card Content */}
            <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl px-8 py-10 w-full max-w-md">
              {/* Premium Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur"></div>
                  <div className="relative px-6 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <span className="text-white text-sm font-semibold tracking-wide">
                      MyKugy Beta
                    </span>
                  </div>
                </div>
              </div>

              {/* Logo Container */}
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

              {/* Title and Subtitle */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">
                  AI Anime Chat
                </h1>
                <p className="text-blue-200/80 text-sm">
                  MyKugy Premium Experience
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onGoogle}
                  className="w-full py-3.5 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"/>
                    </svg>
                    {currentLang.code === 'jp' ? 'Google でログイン' :
                     currentLang.code === 'en' ? 'Sign in with Google' :
                     'Daftar dengan Google'}
                  </div>
                </button>
                
                <button
                  onClick={handleGuest}
                  className="w-full py-3.5 rounded-xl font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {currentLang.code === 'jp' ? 'ゲストとして始める' :
                   currentLang.code === 'en' ? 'Start as Guest' :
                   'Mulai Sebagai Tamu'}
                </button>
              </div>

              {/* Credits Display */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold shadow-lg">G</span>
                    <span className="text-white text-sm">
                      75 {currentLang.code === 'jp' ? 'クレジット' :
                          currentLang.code === 'en' ? 'Credits' :
                          'Kredit'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold shadow-lg">T</span>
                    <span className="text-white text-sm">
                      20 {currentLang.code === 'jp' ? 'クレジット' :
                          currentLang.code === 'en' ? 'Credits' :
                          'Kredit'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-white/80 text-sm flex items-center justify-center gap-1">
                  <span>Made with</span>
                  <span className="text-red-400 animate-pulse">❤️</span>
                  <span>by MyKugy Team</span>
                </p>
                <p className="mt-1 text-white/60 text-xs">
                  © 2024 MyKugy - v1.0.0 Beta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSelect;
