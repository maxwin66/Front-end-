import { createContext, useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

// Constants for consistent timestamp and user
const TIMESTAMP = '2025-06-11 19:45:00';
const USER = 'lillysummer9794';

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
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Default options for all toasts
            className: '',
            duration: 3000,
            style: {
              background: darkMode ? '#1f2937' : '#fff',
              color: darkMode ? '#fff' : '#1f2937',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            },
            // Custom options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: 'white',
              },
              style: {
                background: darkMode ? '#065f46' : '#ecfdf5',
                color: darkMode ? '#fff' : '#065f46',
                border: darkMode ? '1px solid #047857' : '1px solid #6ee7b7',
              },
            },
            error: {
              duration: 3000,
              iconTheme: {
                primary: '#EF4444',
                secondary: 'white',
              },
              style: {
                background: darkMode ? '#991b1b' : '#fef2f2',
                color: darkMode ? '#fff' : '#991b1b',
                border: darkMode ? '1px solid #b91c1c' : '1px solid #fca5a5',
              },
            },
            loading: {
              duration: 5000,
              style: {
                background: darkMode ? '#1f2937' : '#fff',
                color: darkMode ? '#fff' : '#1f2937',
                border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              },
            },
          }}
        />
      </div>
    </UiContext.Provider>
  );
}

export default MyApp;
