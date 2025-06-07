import { useState, createContext } from "react";
import "../styles/globals.css";

// Context supaya theme, darkMode, lang bisa diakses semua halaman
export const UiContext = createContext({
  theme: { name: "Biru Langit", color: "#38bdf8", gradient: "from-blue-400 to-sky-400" },
  setTheme: (_: any) => {},
  darkMode: false,
  setDarkMode: (_: boolean) => {},
  lang: "id",
  setLang: (_: string) => {},
});

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("id"); // Default ke Indonesia, gak perlu switcher

  // Pake theme default statis, hapus array themes dan setTheme
  const theme = { name: "Biru Langit", color: "#38bdf8", gradient: "from-blue-400 to-sky-400" };

  return (
    <UiContext.Provider value={{ theme, setTheme: () => {}, darkMode, setDarkMode, lang, setLang }}>
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`} style={{ background: darkMode ? "#1e293b" : theme.color }}>
        <Component {...pageProps} />
      </div>
    </UiContext.Provider>
  );
}

export default MyApp;
