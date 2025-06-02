import { useState, createContext } from "react";
import "../styles/globals.css";

// Theme/Language context agar bisa diakses semua halaman & komponen
export const UiContext = createContext({
  theme: { name: "Biru Langit", color: "#38bdf8", gradient: "from-blue-400 to-sky-400" },
  setTheme: (_: any) => {},
  darkMode: false,
  setDarkMode: (_: boolean) => {},
  lang: "id",
  setLang: (_: string) => {},
});

const themes = [
  { name: "Biru Langit", color: "#38bdf8", gradient: "from-blue-400 to-sky-400" },
  { name: "Ungu", color: "#a78bfa", gradient: "from-purple-400 to-fuchsia-400" },
  { name: "Pink", color: "#fb7185", gradient: "from-pink-400 to-rose-400" },
  { name: "Hijau", color: "#34d399", gradient: "from-emerald-400 to-teal-300" },
];

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState(themes[0]);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("id");

  return (
    <UiContext.Provider value={{ theme, setTheme, darkMode, setDarkMode, lang, setLang }}>
      <Component {...pageProps} />
    </UiContext.Provider>
  );
}

export default MyApp;
