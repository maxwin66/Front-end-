import { createContext, useState } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

interface UiContextType {
  theme: string;
  setTheme: (theme: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  lang: string;
  setLang: (lang: string) => void;
}

export const UiContext = createContext<UiContextType>({
  theme: 'light',
  setTheme: () => {},
  darkMode: false,
  setDarkMode: () => {},
  lang: 'id',
  setLang: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState('light');
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('id');

  return (
    <UiContext.Provider
      value={{
        theme,
        setTheme,
        darkMode,
        setDarkMode,
        lang,
        setLang,
      }}
    >
      <Component {...pageProps} />
    </UiContext.Provider>
  );
}

export default MyApp;
