import { useContext } from "react";
import { UiContext } from "../pages/_app";

const themes = [
  { name: "Biru Langit", color: "#38bdf8", gradient: "from-blue-400 to-sky-400" },
  { name: "Ungu", color: "#a78bfa", gradient: "from-purple-400 to-fuchsia-400" },
  { name: "Pink", color: "#fb7185", gradient: "from-pink-400 to-rose-400" },
  { name: "Hijau", color: "#34d399", gradient: "from-emerald-400 to-teal-300" },
];

const languages = [
  { code: "id", label: "🇮🇩 Indonesia" },
  { code: "en", label: "🇬🇧 English" },
  { code: "jp", label: "🇯🇵 日本語" },
];

export default function ThemeLangSwitcher() {
  const { theme, setTheme, darkMode, setDarkMode, lang, setLang } = useContext(UiContext);

  return (
    <div className="fixed top-5 left-5 z-30 flex gap-2">
      {/* Theme color */}
      <select
        className="rounded px-2 py-1 bg-white/60 text-blue-900 font-bold shadow"
        value={theme.name}
        onChange={e => setTheme(themes.find(t => t.name === e.target.value) || themes[0])}
      >
        {themes.map(t => <option value={t.name} key={t.name}>{t.name}</option>)}
      </select>
      {/* Language */}
      <select
        className="rounded px-2 py-1 bg-white/60 text-blue-900 font-bold shadow"
        value={lang}
        onChange={e => setLang(e.target.value)}
      >
        {languages.map(l => <option value={l.code} key={l.code}>{l.label}</option>)}
      </select>
      {/* Dark mode */}
      <button
        className="bg-white/30 hover:bg-white/60 p-2 rounded-full shadow transition"
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? "Light Mode" : "Dark Mode"}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
