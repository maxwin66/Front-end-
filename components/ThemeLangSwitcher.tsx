import React, { useState, useContext } from 'react';
import { UiContext } from '../pages/_app';

const ThemeLangSwitcher = () => {
  const { lang, setLang } = useContext(UiContext);
  const [showLanguages, setShowLanguages] = useState(false);

  const LANGUAGES = [
    { code: 'id', name: 'Indonesian', flag: '🇮🇩', local: 'Indonesia' },
    { code: 'en', name: 'English', flag: '🇺🇸', local: 'English' },
    { code: 'jp', name: 'Japanese', flag: '🇯🇵', local: '日本語' }
  ];

  return (
    <div className="fixed top-4 left-4 flex gap-2 z-50">
      {/* Theme Button */}
      <button 
        className="px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm text-blue-900 text-sm font-medium hover:bg-white/90 transition"
      >
        Biru Langit
      </button>

      {/* Language Button */}
      <div className="relative">
        <button 
          onClick={() => setShowLanguages(!showLanguages)}
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/80 backdrop-blur-sm text-blue-900 text-sm font-medium hover:bg-white/90 transition"
        >
          <span role="img" aria-label={LANGUAGES.find(l => l.code === lang)?.name}>
            {LANGUAGES.find(l => l.code === lang)?.flag}
          </span>
          {LANGUAGES.find(l => l.code === lang)?.local}
        </button>

        {showLanguages && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white/95 backdrop-blur-sm rounded-md shadow-lg overflow-hidden">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLang?.(language.code);
                  setShowLanguages(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 transition ${
                  lang === language.code ? 'bg-blue-50' : ''
                }`}
              >
                <span role="img" aria-label={language.name}>{language.flag}</span>
                <span>{language.local}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeLangSwitcher;
