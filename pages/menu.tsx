import React, { useContext } from "react";
import { useRouter } from "next/router";
import ThemeLangSwitcher from "../components/ThemeLangSwitcher";
import { UiContext } from "./_app";

const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat",
  minHeight: "100vh"
};
const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh"
};

const MenuPage: React.FC = () => {
  const router = useRouter();
  const { theme, darkMode } = useContext(UiContext);

  function handleComingSoon(feature: string) {
    window.alert(
      `Fitur "${feature}" akan segera hadir di MyKugy! Nantikan update berikutnya ya!`
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center transition-colors"
      style={darkMode ? darkBg : animeBg}
    >
      <ThemeLangSwitcher />

      <div className="bg-white/80 dark:bg-slate-800/90 rounded-3xl shadow-2xl px-8 py-10 w-full max-w-md mx-4 flex flex-col items-center border border-blue-200 dark:border-slate-600 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold px-4 py-1 rounded-full shadow text-xs tracking-wider">
            Pilih Fitur
          </span>
        </div>
        <h1
          className="text-2xl font-extrabold text-center mb-6 drop-shadow-lg tracking-wide"
          style={{
            color: theme.color,
            textShadow: darkMode
              ? "0 2px 8px #0ea5e9bb"
              : "0 2px 8px #0369a1cc"
          }}
        >
          Menu Utama MyKugy
        </h1>
        <button
          className={`w-full mb-4 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r ${theme.gradient} shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 outline-none`}
          onClick={() => router.push("/")}
        >
          Ngobrol Bareng AI
        </button>
        <button
          className="w-full mb-4 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-green-400 to-blue-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 outline-none"
          onClick={() => handleComingSoon("Buat Gambar")}
        >
          Buat Gambar <span className="ml-2 text-xs font-normal">Segera Hadir</span>
        </button>
        <button
          className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-pink-500 to-yellow-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 outline-none"
          onClick={() => handleComingSoon("Bikin Novel")}
        >
          Bikin Novel <span className="ml-2 text-xs font-normal">Segera Hadir</span>
        </button>
        <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-300">
          <span className="block mb-1 italic">
            “Pilih fitur favoritmu untuk mulai berkreasi di MyKugy!” 
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
