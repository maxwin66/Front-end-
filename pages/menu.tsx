import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UiContext } from "./_app";

const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat",
  minHeight: "100vh",
};

const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh",
};

const MenuPage: React.FC = () => {
  const router = useRouter();
  const { darkMode } = useContext(UiContext);
  const [email, setEmail] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [credits, setCredits] = useState(25); // Default 25 buat tes

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gotEmail = params.get("email");
    const guest = params.get("guest");
    const creditsParam = params.get("credits");

    if (gotEmail) {
      setEmail(gotEmail);
      setCredits(creditsParam ? parseInt(creditsParam) || 25 : 25);
      setIsGuest(gotEmail.toLowerCase().startsWith("guest"));
    } else if (guest === "1") {
      setIsGuest(true);
      setCredits(creditsParam ? parseInt(creditsParam) || 25 : 25);
    } else {
      router.push("/");
    }
    console.log("MenuPage params:", { gotEmail, guest, creditsParam, credits });
  }, [router.query]);

  function handleChatClick() {
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (isGuest) params.set("guest", "1");
    params.set("credits", credits.toString());
    router.push(`/chat?${params.toString()}`);
  }

  function handleGenerateImageClick() {
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (isGuest) params.set("guest", "1");
    params.set("credits", credits.toString());
    router.push(`/generate-image?${params.toString()}`);
  }

  function handleComingSoon() {
    alert("Fitur ini akan segera hadir di MyKugy! Nantikan update ya!");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors" style={darkMode ? darkBg : animeBg}>
      <div className="bg-white/80 dark:bg-slate-800/90 rounded-3xl shadow-2xl px-8 py-10 w-full max-w-md mx-4 flex flex-col items-center border border-blue-200 dark:border-slate-600 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold px-4 py-1 rounded-full shadow text-xs tracking-wider">
            Pilih Fitur
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-center mb-6 drop-shadow-lg tracking-wide" style={{ color: "#38bdf8", textShadow: darkMode ? "0 2px 8px #0ea5e9bb" : "0 2px 8px #0369a1cc" }}>
          Menu Utama MyKugy
        </h1>

        <div className="w-full mb-6 px-4 py-2 bg-blue-50 dark:bg-slate-700 rounded-xl text-center">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
            Kredit Tersedia: <span className="font-bold">{credits}</span>
          </span>
        </div>

        <button className="w-full mb-4 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-blue-400 to-sky-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent" onClick={handleChatClick}>
          Ngobrol Bareng AI
        </button>

        <button className="w-full mb-4 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-green-400 to-blue-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent" onClick={handleGenerateImageClick}>
          Buat Gambar
        </button>

        <button className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-pink-500 to-yellow-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent" onClick={handleComingSoon}>
          Bikin Novel
          <span className="ml-2 text-xs font-normal">Segera Hadir</span>
        </button>

        <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-300">
          <span className="block mb-1 italic">Pilih fitur favoritmu untuk mulai berkreasi di MyKugy!</span>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
