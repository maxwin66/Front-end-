import { useState, useEffect } from "react";
import HomeSelect from "../components/HomeSelect";
import ChatInterface from "../components/ChatInterface";

// --- Carousel fitur utama ---
const features = [
  "🎁 Gratis 75 Kredit untuk Pengguna Baru!",
  "🚀 Login dengan Google atau Sebagai Tamu",
  "💬 Chat AI Karakter Anime 24/7",
  "✨ Privasi Aman & Tampilan Premium"
];

// --- Testimoni mini ---
const testimonials = [
  { user: "Asyutad", text: "AI-nya seru banget, kayak ngobrol sama karakter anime asli!" },
  { user: "Edlantod", text: "Tampilan aplikasi premium & gampang dipakai. Keren banget!" }
];

// --- FAQ mini ---
const faqs = [
  { q: "Bagaimana cara kerja kredit?", a: "Setiap kali chat, kredit akan berkurang 1. User baru dapat 75 kredit gratis." },
  { q: "Apakah gratis?", a: "Ya, kamu bisa mencoba gratis sebagai guest atau login Google!" },
  { q: "Bisa diakses dari HP?", a: "Tentu saja, aplikasi ini 100% responsif untuk HP & desktop." }
];

const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat",
  minHeight: "100vh"
};
const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh"
};

const IndexPage = () => {
  const [step, setStep] = useState<"start" | "select" | "guest" | "login">("start");
  const [credits, setCredits] = useState(0);
  const [email, setEmail] = useState("");
  const [featureIdx, setFeatureIdx] = useState(0);
  const [carouselProg, setCarouselProg] = useState(0); // Untuk progress bar
  const [darkMode, setDarkMode] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [blurTrans, setBlurTrans] = useState(false);

  // Carousel fitur: otomatis berganti tiap 2.5 detik + progress
  useEffect(() => {
    if (step === "start") {
      const interval = setInterval(() => {
        setFeatureIdx(i => (i + 1) % features.length);
        setCarouselProg(0);
      }, 2500);
      const prog = setInterval(() => {
        setCarouselProg(p => (p < 100 ? p + 2 : 100));
      }, 50);
      return () => {
        clearInterval(interval);
        clearInterval(prog);
      };
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

  // Transisi blur saat klik Mulai
  const handleStart = () => {
    setBlurTrans(true);
    setTimeout(() => {
      setBlurTrans(false);
      setStep("select");
    }, 350);
  };

  // --- Halaman Depan Premium ---
  if (step === "start") {
    return (
      <div
        className={`flex flex-col min-h-screen relative overflow-hidden transition-colors duration-500`}
        style={darkMode ? darkBg : animeBg}
      >
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

        {/* Toggle Dark Mode */}
        <button
          className="absolute top-5 right-5 z-20 bg-white/30 hover:bg-white/60 p-2 rounded-full shadow transition"
          onClick={() => setDarkMode(d => !d)}
          title={darkMode ? "Mode Cerah" : "Mode Gelap"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Badge Beta */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-8 z-10">
          <span className="bg-gradient-to-r from-sky-500 to-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Beta</span>
        </div>

        {/* Logo & Judul */}
        <div className="absolute top-14 left-0 right-0 flex flex-col items-center z-10">
          <div
            className="text-2xl font-extrabold drop-shadow-lg tracking-wider"
            style={{ color: "#38bdf8", textShadow: "0 2px 8px #0369a1cc" }}
          >
            MyKugy Ai Chat Anime
          </div>
        </div>

        {/* Card + Tombol Mulai */}
        <div className="flex flex-1 items-center justify-center">
          <div className={`bg-white/30 ${darkMode ? "bg-opacity-10" : "backdrop-blur-2xl"} rounded-3xl shadow-2xl p-8 flex flex-col items-center min-w-[320px] max-w-[94vw] w-full mx-2 border border-white/50 relative`}>
            {/* Carousel fitur */}
            <div className="mb-6 w-full">
              <div className="text-md text-blue-900 font-semibold text-center transition-all duration-500 min-h-[28px]">
                {features[featureIdx]}
              </div>
              {/* Progress bar carousel */}
              <div className="w-full h-1 bg-blue-100 rounded-full mt-1">
                <div
                  className="h-1 bg-sky-400 rounded-full transition-all"
                  style={{ width: `${carouselProg}%` }}
                />
              </div>
            </div>
            {/* Tombol Mulai besar */}
            <button
              className={`px-16 py-4 text-2xl rounded-full font-bold bg-gradient-to-r from-blue-400 to-sky-400 shadow-xl text-white hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200/40 animate-glow ${blurTrans ? "blur-sm" : ""}`}
              onClick={handleStart}
              style={{ letterSpacing: '2px' }}
              disabled={blurTrans}
            >
              Mulai
            </button>
            {/* Transisi Blur */}
            {blurTrans && <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-3xl transition-all duration-300" />}
            <style>{`
              .animate-glow {
                box-shadow: 0 0 20px 3px #a5f3fc80, 0 0 40px 7px #38bdf860;
                transition: box-shadow 0.3s;
              }
              .animate-glow:hover {
                box-shadow: 0 0 36px 10px #60a5fa88, 0 0 72px 12px #22d3ee80;
              }
            `}</style>

            {/* Testimoni Mini */}
            <div className="mt-7 mb-2 w-full flex justify-center gap-4">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white/60 text-blue-900 px-3 py-1 rounded-lg shadow text-xs max-w-[160px] italic">
                  “{t.text}” <span className="not-italic font-bold text-blue-600">- {t.user}</span>
                </div>
              ))}
            </div>

            {/* CTA Join Komunitas */}
            <div className="text-xs font-semibold mt-2 mb-1 text-blue-700 flex items-center gap-1 justify-center">
              <span>Gabung komunitas kami di</span>
              <a href="https://discord.gg/yourbrand" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-400">Discord</a>
              <span>atau</span>
              <a href="https://instagram.com/yourbrand" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-400">Instagram</a>
            </div>

            {/* FAQ Mini */}
            <div className="mt-2">
              <button
                className="text-blue-400 text-sm underline hover:text-blue-700"
                onClick={() => setFaqOpen(f => !f)}
              >{faqOpen ? "Tutup FAQ" : "FAQ / Info Singkat"}</button>
              {faqOpen &&
                <div className="mt-2 bg-white/70 px-4 py-2 rounded shadow max-w-xs text-xs text-blue-900 space-y-1">
                  {faqs.map((f, i) => (
                    <div key={i}>
                      <b>{f.q}</b><br />
                      {f.a}
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        </div>

        {/* Social media & artwork credit & versi */}
        <div className="absolute bottom-3 w-full flex flex-col items-center z-10 text-xs text-white/80">
          <div className="mb-1 flex gap-2">
            <span className="bg-blue-300/80 text-sky-800 px-2 py-0.5 rounded font-bold text-xs">v1.0.0 Beta</span>
            <span>|</span>
            <a href="https://instagram.com/yourbrand" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">Instagram</a>
            <span>|</span>
            <a href="https://discord.gg/yourbrand" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">Discord</a>
          </div>
          <div>
            Artwork by AI | <a href="/privacy" className="underline hover:text-blue-200">Kebijakan Privasi</a>
          </div>
          <div className="mt-1">
            Developed with <span className="text-pink-300">❤️</span> by <b className="text-sky-300">Eichiro</b>
          </div>
        </div>
      </div>
    );
  }

  // --- HALAMAN BERIKUTNYA (tidak diubah) ---
  if (step === "select") {
    return (
      <HomeSelect
        onGoogle={handleGoogleLogin}
        onGuest={handleGuest}
        bgStyle={darkMode ? darkBg : animeBg}
      />
    );
  }

  return (
    <ChatInterface
      email={email}
      isGuest={step === "guest"}
      credits={credits}
      bgStyle={darkMode ? darkBg : animeBg}
    />
  );
};

export default IndexPage;
