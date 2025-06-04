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

export default function MenuPage() {
  const router = useRouter();
  const { theme, darkMode } = useContext(UiContext);

  // Handler untuk tombol fitur yang belum tersedia
  function handleComingSoon(feature: string) {
    window.alert(`Fitur "${feature}" akan segera hadir di MyKugy! Nantikan update selanjutnya, ya!`);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={darkMode ? darkBg : animeBg}
    >
      <ThemeLangSwitcher />
      <div className="bg-white/80 rounded-3xl shadow-2xl px-8 py-10 w-full max-w-md mx-4 flex flex-col items-center">
        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ color: theme.color }}
        >
          Pilih Fitur MyKugy
        </h1>
        <button
          className={`w-full mb-4 py-4 rounded-lg font-semibold text-white text-lg bg-gradient-to-r ${theme.gradient} hover:scale-105 transition shadow-lg`}
          onClick={() => router.push("/")}
        >
          Ngobrol Bareng AI
        </button>
        <button
          className="w-full mb-4 py-4 rounded-lg font-semibold text-white text-lg bg-gradient-to-r from-green-400 to-blue-400 hover:scale-105 transition shadow-lg"
          onClick={() => handleComingSoon("Buat Gambar")}
        >
          Buat Gambar
        </button>
        <button
          className="w-full py-4 rounded-lg font-semibold text-white text-lg bg-gradient-to-r from-pink-500 to-yellow-400 hover:scale-105 transition shadow-lg"
          onClick={() => handleComingSoon("Bikin Novel")}
        >
          Bikin Novel
        </button>
      </div>
    </div>
  );
}
