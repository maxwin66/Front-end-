import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UiContext } from "./_app";

const BACKEND_URL = "https://backend-cb98.onrender.com";

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
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem("token");
      const storedEmail = localStorage.getItem("user_email");
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get("email");
      const urlCredits = params.get("credits");

      // Redirect ke home jika tidak ada token atau email
      if (!token || !storedEmail) {
        console.log("No token or email found, redirecting to home");
        router.push("/");
        return;
      }

      try {
        // Verifikasi credits dengan backend
        const response = await fetch(
          `${BACKEND_URL}/api/credits?user_email=${encodeURIComponent(storedEmail)}`
        );
        const data = await response.json();

        if (response.ok) {
          setCredits(parseInt(data.credits));
          setEmail(storedEmail);
        } else {
          throw new Error(data.error || "Failed to fetch credits");
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
        // Fallback ke URL params jika API gagal
        setCredits(urlCredits ? parseInt(urlCredits) : 25);
        setEmail(urlEmail || storedEmail);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleComingSoon = (feature: string) => {
    window.alert(`Fitur "${feature}" akan segera hadir di MyKugy! Nantikan update berikutnya ya!`);
  };

  const handleChatClick = () => {
    if (!credits) {
      alert("Maaf, kredit Anda habis. Silakan login dengan Google untuk mendapatkan kredit tambahan.");
      return;
    }
    router.push(`/chat?email=${encodeURIComponent(email)}&credits=${credits}`);
  };

  const handleGenerateImageClick = () => {
    if (!credits || credits < 10) {
      alert("Maaf, untuk membuat gambar diperlukan minimal 10 kredit.");
      return;
    }
    router.push(`/generate-image?email=${encodeURIComponent(email)}&credits=${credits}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={darkMode ? darkBg : animeBg}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={darkMode ? darkBg : animeBg}>
        <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-md p-8 rounded-xl shadow-xl text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
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

        <button 
          onClick={handleChatClick}
          className="w-full mb-4 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-blue-400 to-sky-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
        >
          Ngobrol Bareng AI
          {credits === 0 && (
            <span className="block text-xs font-normal mt-1">
              Kredit habis
            </span>
          )}
        </button>

        <button 
          onClick={handleGenerateImageClick}
          className="w-full mb-4 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-green-400 to-blue-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
        >
          Buat Gambar
          {(credits || 0) < 10 && (
            <span className="block text-xs font-normal mt-1">
              Butuh 10 kredit
            </span>
          )}
        </button>

        <button 
          onClick={() => handleComingSoon("Bikin Novel")}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-pink-500 to-yellow-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
        >
          Bikin Novel
          <span className="ml-2 text-xs font-normal">Segera Hadir</span>
        </button>

        <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-300">
          <span className="block mb-1 italic">Pilih fitur favoritmu untuk mulai berkreasi di MyKugy!</span>
          <button
            onClick={() => {
              sessionStorage.removeItem("token");
              localStorage.removeItem("user_email");
              router.push("/");
            }}
            className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
