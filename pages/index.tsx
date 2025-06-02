import { useState, useEffect } from "react";
import HomeSelect from "../components/HomeSelect";
import ChatInterface from "../components/ChatInterface";

// ----- Fitur carousel (teks fitur berganti otomatis) -----
const features = [
  "🎁 Gratis 75 Kredit untuk Pengguna Baru!",
  "🚀 Login dengan Google atau Sebagai Tamu",
  "💬 Chat AI Karakter Anime 24/7",
  "✨ Privasi Aman & Tampilan Premium"
];

// Pakai direct raw image link dari GitHub
const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat",
  minHeight: "100vh"
};

const IndexPage = () => {
  const [step, setStep] = useState<"start" | "select" | "guest" | "login">("start");
  const [credits, setCredits] = useState(0);
  const [email, setEmail] = useState("");
  const [featureIdx, setFeatureIdx] = useState(0);

  // Carousel fitur: otomatis berganti setiap 2.5 detik
  useEffect(() => {
    if (step === "start") {
      const t = setInterval(() => setFeatureIdx(i => (i + 1) % features.length), 2500);
      return () => clearInterval(t);
    }
  }, [step]);

  const handleGoogleLogin = () => {
    if (typeof window !== "undefined") {
      window.location.href = "https://backend-cb98.onrender.com/auth/google";
    }
  };

  const handleGuest = () => {
    setStep("guest");
    setCredits(20);
    setEmail("");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && step === "start") {
      const params = new URLSearchParams(window.location.search);
      const gotEmail = params.get("email");
      if (gotEmail) {
        setEmail(gotEmail);
        setStep("login");
        setCredits(75);
        window.history.replaceState({}, document.title, "/");
      }
    }
  }, [step]);

  // ------ HALAMAN DEPAN PREMIUM ------
  if (step === "start") {
    return (
      <div className="flex flex-col min-h-screen relative overflow-hidden" style={animeBg}>
        {/* Efek bintang premium */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <svg width="100%" height="100%">
            {[...Array(30)].map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 100 + "%"}
                cy={Math.random() * 100 + "%"}
                r={Math.random() * 1.8 + 0.5}
                fill="#fff"
                opacity={Math.random() * 0.7 + 0.2}
              />
            ))}
          </svg>
        </div>

        {/* Logo dan Judul */}
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center mt-8 z-10">
          <div className="text-2xl font-extrabold text-white drop-shadow-lg tracking-wider">MyKugy</div>
          <div className="text-base text-blue-100 drop-shadow-sm italic">AI Chat Anime</div>
        </div>

        {/* Glass Card dengan tombol mulai */}
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-white/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 flex flex-col items-center min-w-[320px] max-w-[94vw] w-full mx-2 border border-white/50">
            {/* Carousel fitur */}
            <div className="mb-6">
              <div className="text-md text-blue-900 font-semibold text-center transition-all duration-500 min-h-[28px]">
                {features[featureIdx]}
              </div>
            </div>
            {/* Tombol Mulai besar */}
            <button
              className="px-16 py-4 text-2xl rounded-full font-bold bg-gradient-to-r from-blue-400 to-green-300 shadow-xl text-white hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200/40 animate-glow"
              onClick={() => setStep("select")}
              style={{ letterSpacing: '2px' }}
            >
              Mulai
            </button>
            <style>{`
              .animate-glow {
                box-shadow: 0 0 20px 3px #a5f3fc80, 0 0 40px 7px #60a5fa60;
                transition: box-shadow 0.3s;
              }
              .animate-glow:hover {
                box-shadow: 0 0 36px 10px #60a5fa88, 0 0 72px 12px #22d3ee80;
              }
            `}</style>
          </div>
        </div>

        {/* Social media & artwork credit */}
        <div className="absolute bottom-3 w-full flex flex-col items-center z-10 text-xs text-white/80">
          <div className="flex gap-3 mb-1">
            <a href="https://instagram.com/yourbrand" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">Instagram</a>
            <span>|</span>
            <a href="https://discord.gg/yourbrand" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">Discord</a>
          </div>
          <div>
            Artwork by AI | <a href="/privacy" className="underline hover:text-blue-200">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    );
  }

  // ------ HALAMAN BERIKUTNYA (TIDAK DIUBAH) ------
  if (step === "select") {
    return (
      <HomeSelect
        onGoogle={handleGoogleLogin}
        onGuest={handleGuest}
        bgStyle={animeBg}
      />
    );
  }

  return (
    <ChatInterface
      email={email}
      isGuest={step === "guest"}
      credits={credits}
      bgStyle={animeBg}
    />
  );
};

export default IndexPage;
