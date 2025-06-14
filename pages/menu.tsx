import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UiContext } from "./_app";
import ParticlesBackground from "../components/ParticlesBackground";

const BACKEND_URL = "https://backend-cb98.onrender.com";

// Background styles
const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat fixed",
};

const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
};

const MenuPage = () => {
  const router = useRouter();
  const { darkMode } = useContext(UiContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const storedEmail = localStorage.getItem("user_email");
        const params = new URLSearchParams(window.location.search);
        const urlEmail = params.get("email");

        if (urlEmail && !storedEmail) {
          localStorage.setItem("user_email", urlEmail);
          setEmail(urlEmail);
        }

        if (!token && !storedEmail && !urlEmail) {
          console.log("No auth found, redirecting to home");
          router.push("/");
          return;
        }

        const emailToUse = storedEmail || urlEmail;
        const isGuest = emailToUse?.includes('@guest.kugy.ai') || false;
        
        try {
          // Untuk development, langsung gunakan localStorage atau default
          if (process.env.NODE_ENV === 'development') {
            const storedCredits = localStorage.getItem("user_credits");
            const urlCredits = params.get("credits");
            const parsedCredits = urlCredits ? parseInt(urlCredits) : (storedCredits ? parseInt(storedCredits) : (isGuest ? 25 : 75));
            const finalCredits = isGuest ? Math.min(parsedCredits, 25) : parsedCredits;
            setCredits(finalCredits);
            localStorage.setItem("user_credits", String(finalCredits));
            setEmail(emailToUse);
          } else {
            // Untuk production, coba fetch dari backend
            const response = await fetch(
              `${BACKEND_URL}/api/credits?user_email=${encodeURIComponent(emailToUse)}`
            );
            const data = await response.json();

            if (response.ok) {
              const newCredits = parseInt(data.credits);
              const finalCredits = isGuest ? Math.min(newCredits, 25) : newCredits;
              setCredits(finalCredits);
              localStorage.setItem("user_credits", String(finalCredits));
              setEmail(emailToUse);
            } else {
              const storedCredits = localStorage.getItem("user_credits");
              const parsedCredits = storedCredits ? parseInt(storedCredits) : (isGuest ? 25 : 75);
              const finalCredits = isGuest ? Math.min(parsedCredits, 25) : parsedCredits;
              setCredits(finalCredits);
              localStorage.setItem("user_credits", String(finalCredits));
            }
          }
        } catch (error) {
          console.error("Error fetching credits:", error);
          const storedCredits = localStorage.getItem("user_credits");
          const urlCredits = params.get("credits");
          const parsedCredits = urlCredits ? parseInt(urlCredits) : (storedCredits ? parseInt(storedCredits) : (isGuest ? 25 : 75));
          const finalCredits = isGuest ? Math.min(parsedCredits, 25) : parsedCredits;
          setCredits(finalCredits);
          localStorage.setItem("user_credits", String(finalCredits));
        }

      } catch (error) {
        console.error("Auth check error:", error);
        setError("Terjadi kesalahan. Silakan coba login kembali.");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_credits");
    router.push("/");
  };

  const handleComingSoon = (feature: string) => {
    window.alert(`Fitur "${feature}" akan segera hadir di MyKugy! Nantikan update berikutnya ya!`);
  };

  const handleChatClick = () => {
    const isGuest = email?.includes('@guest.kugy.ai') || false;
    if (!credits || (isGuest && credits > 25)) {
      alert("Maaf, kredit Anda habis. Silakan login dengan Google untuk mendapatkan kredit tambahan.");
      return;
    }
    router.push(`/chat?email=${encodeURIComponent(email)}&credits=${credits}`);
  };

  const handleGenerateImageClick = () => {
    const isGuest = email?.includes('@guest.kugy.ai') || false;
    if (!credits || credits < 10 || (isGuest && credits > 25)) {
      alert("Maaf, untuk membuat gambar diperlukan minimal 10 kredit.");
      return;
    }
    router.push(`/generate-image?email=${encodeURIComponent(email)}&credits=${credits}`);
  };

  const handleVirtualSimsClick = () => {
    const isGuest = email?.includes('@guest.kugy.ai') || false;
    if (!credits || credits < 25 || (isGuest && credits > 25)) {
      // Tampilkan pesan error dengan styling yang lebih baik
      setError("Maaf, untuk membeli nomor virtual diperlukan minimal 25 kredit.");
      setTimeout(() => setError(''), 3000);
      return;
    }
    router.push(`/virtual-sims?email=${encodeURIComponent(email)}&credits=${credits}`);
  };

  const handleKugyAgentClick = () => {
    const isGuest = email?.includes('@guest.kugy.ai') || false;
    if (!credits || credits < 5 || (isGuest && credits > 25)) {
      setError("Maaf, untuk menggunakan KugyAgent diperlukan minimal 5 kredit.");
      setTimeout(() => setError(''), 3000);
      return;
    }
    router.push(`/KugyAgent?email=${encodeURIComponent(email)}&credits=${credits}`);
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
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative" style={darkMode ? darkBg : animeBg}>
      <ParticlesBackground darkMode={darkMode} />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-extrabold text-center mb-6 drop-shadow-lg tracking-wide" style={{ color: "#38bdf8", textShadow: darkMode ? "0 2px 8px #0ea5e9bb" : "0 2px 8px #0369a1cc" }}>
          Menu Utama MyKugy
        </h1>

        <div className="w-full mb-6 px-4 py-2 bg-blue-50 dark:bg-slate-700 rounded-xl text-center">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
            Kredit Tersedia: <span className="font-bold">{credits}</span>
          </span>
        </div>

        {error && (
          <div className="w-full mb-4 px-4 py-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-center">
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </span>
          </div>
        )}

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
          onClick={handleKugyAgentClick}
          className="w-full mb-4 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
        >
          🤖 KugyAgent
          <span className="block text-xs font-normal mt-1">
            Multi-AI Collaboration
          </span>
          {(credits || 0) < 5 && (
            <span className="block text-xs font-normal mt-1">
              Butuh 5 kredit
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
          onClick={handleVirtualSimsClick}
          className="w-full mb-4 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-violet-500 to-purple-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
        >
          Virtual SIMs
          {(credits || 0) < 25 && (
            <span className="block text-xs font-normal mt-1">
              Butuh 25 kredit
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
            onClick={handleLogout}
            className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
