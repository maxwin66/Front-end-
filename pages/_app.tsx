import { createContext, useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

interface UiContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  lang: 'id' | 'en' | 'jp';
  setLang: (lang: 'id' | 'en' | 'jp') => void;
}

export const UiContext = createContext<UiContextType>({
  theme: 'light',
  setTheme: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
  lang: 'id',
  setLang: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  // Use more specific types
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<'id' | 'en' | 'jp'>('id');

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLang = localStorage.getItem('lang');

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    if (savedLang && ['id', 'en', 'jp'].includes(savedLang)) {
      setLang(savedLang as 'id' | 'en' | 'jp');
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <UiContext.Provider
      value={{
        theme,
        setTheme,
        darkMode,
        toggleDarkMode,
        lang,
        setLang,
      }}
    >
      <div className={`app ${theme} ${darkMode ? 'dark' : ''}`}>
        <Component {...pageProps} />
      </div>
    </UiContext.Provider>
  );
}

export default MyApp;
