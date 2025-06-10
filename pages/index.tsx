import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import HomeSelect from "../components/HomeSelect";
import ParticlesBackground from "../components/ParticlesBackground";
import { UiContext } from "./_app";

const animeQuotes = [
  { text: "Impian itu bukan untuk dikejar, tapi untuk diwujudkan.", author: "One Piece" },
  { text: "Tidak apa-apa untuk menangis, tapi bangkitlah setelahnya.", author: "Naruto" },
  { text: "Hidup ini seperti pensil yang pasti akan habis, tapi meninggalkan tulisan indah.", author: "Natsume Yuujinchou" },
  { text: "Jangan remehkan kekuatan impian.", author: "Haikyuu!!" },
  { text: "Setiap orang punya waktu yang berharga.", author: "Your Name" },
  { text: "Jika kamu tidak mencoba, kamu tidak akan pernah tahu hasilnya.", author: "Kuroko no Basket" },
  { text: "Dunia ini kejam, tapi juga sangat indah.", author: "Attack on Titan" },
];

const texts = {
  start: "Mulai",
  carousel: [
    "🎁 Login Google - 75 Kredit | Guest - 25 Kredit!",
    "🚀 Login dengan Google atau Sebagai Tamu",
    "💬 Chat AI Karakter Anime 24/7",
    "✨ Privasi Aman & Tampilan Premium",
  ],
  version: "Versi",
  developed: "Dikembangkan dengan",
  by: "oleh",
};

const BACKEND_URL = "https://backend-cb98.onrender.com";

const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat",
  minHeight: "100vh",
};

const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh",
};

const IndexPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<"start" | "select">("start");
  const [featureIdx, setFeatureIdx] = useState(0);
  const [carouselProg, setCarouselProg] = useState(0);
  const [blurTrans, setBlurTrans] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [quoteIdx, setQuoteIdx] = useState(Math.floor(Math.random() * animeQuotes.length));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { darkMode } = useContext(UiContext);

  useEffect(() => {
    // Clear any existing session data
    sessionStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_credits');
  }, []);

  useEffect(() => {
    if (step !== "start") return;
    const listener = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x: x * 12, y: y * 8 });
    };
    window.addEventListener("mousemove", listener);
    return () => window.removeEventListener("mousemove", listener);
  }, [step]);

  useEffect(() => {
    if (step === "start") {
      const interval = setInterval(() => {
        setFeatureIdx((i) => (i + 1) % texts.carousel.length);
        setCarouselProg(0);
      }, 2500);
      const prog = setInterval(() => {
        setCarouselProg((p) => (p < 100 ? p + 2 : 100));
      }, 50);
      return () => {
        clearInterval(interval);
        clearInterval(prog);
      };
    }
  }, [step]);

  useEffect(() => {
    if (step !== "start") return;
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % animeQuotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step !== "start") return;
    document.body.style.cursor = "url('/star-cursor.png'), auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [step]);

  const handleStart = () => {
    setBlurTrans(true);
    setTimeout(() => {
      setBlurTrans(false);
      setStep("select");
    }, 450);
  };

  if (step === "start") {
    return (
      <div
        className="flex flex-col min-h-screen relative overflow-hidden transition-colors duration-500"
        style={
          darkMode
            ? darkBg
            : { ...animeBg, backgroundPosition: `${50 + parallax.x}% ${50 + parallax.y}%` }
        }
      >
        <ParticlesBackground darkMode={darkMode} />

        <div className="absolute left-1/2 transform -translate-x-1/2 top-8 z-10">
          <span className="bg-gradient-to-r from-blue-400 to-sky-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            Beta
          </span>
        </div>

        <div className="absolute top-14 left-0 right-0 flex flex-col items-center z-10">
          <div 
            className="text-2xl font-extrabold drop-shadow-lg tracking-wider" 
            style={{ color: "#38bdf8", textShadow: "0 2px 8px #0369a1cc" }}
          >
            MyKugy Ai Chat Anime
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div 
            className={`bg-white/30 ${
              darkMode ? 'bg-opacity-10' : 'backdrop-blur-2xl'
            } rounded-3xl shadow-2xl p-8 flex flex-col items-center min-w-[320px] max-w-[94vw] w-full mx-2 border border-blue-200/50 dark:border-blue-500/20 relative animate-glow`}
          >
            <div className="mb-6 w-full">
              <div 
                className="text-md" 
                style={{ color: "#38bdf8", fontWeight: 700, textAlign: "center" }}
              >
                {texts.carousel[featureIdx]}
              </div>
              <div className="w-full h-1 bg-blue-100 rounded-full mt-1">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${carouselProg}%`, background: "#38bdf8" }}
                />
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={blurTrans || loading}
              className="px-16 py-4 text-2xl rounded-full font-bold bg-gradient-to-r from-blue-400 to-sky-400 shadow-xl text-white hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Loading...' : texts.start}
            </button>

            {blurTrans && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-3xl transition-all duration-300" />
            )}

            <div className="mt-7 mb-2 w-full flex flex-col items-center">
              <div className="text-xs italic text-blue-900 text-center max-w-xs transition-all duration-500">
                "{animeQuotes[quoteIdx].text}"{" "}
                <span className="not-italic font-bold text-blue-600">
                  - {animeQuotes[quoteIdx].author}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 w-full flex flex-col items-center z-10 text-xs text-white/80">
          <div className="mb-1 flex gap-2">
            <span className="bg-blue-300/80 text-sky-800 px-2 py-0.5 rounded font-bold text-xs">
              {texts.version} v1.0.0 Beta
            </span>
            <span>|</span>
            <a 
              href="https://instagram.com/yourbrand" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-300 transition"
            >
              Instagram
            </a>
            <span>|</span>
            <a
              href="https://discord.gg/yourbrand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition"
            >
              Discord
            </a>
          </div>
          <div>
            Artwork by AI | <a href="/privacy" className="underline hover:text-blue-200">Kebijakan Privasi</a>
          </div>
          <div className="mt-1">
            {texts.developed} <span className="text-pink-300">❤️</span> {texts.by}{" "}
            <b className="text-sky-300">Eichiro</b>
          </div>
        </div>
      </div>
    );
  }

  if (step === "select") {
    return (
      <>
        <ParticlesBackground darkMode={darkMode} />
        <HomeSelect
          onGoogle={() => {
            if (typeof window !== "undefined") {
              setLoading(true);
              // Clear any existing auth data
              sessionStorage.removeItem("token");
              localStorage.removeItem("user_email");
              localStorage.removeItem("user_credits");
              
              // Redirect to Google OAuth
              window.location.href = `${BACKEND_URL}/auth/google`;
            }
          }}
          onGuest={async () => {
            try {
              setLoading(true);
              // Generate unique guest email with timestamp and random string
              const timestamp = Date.now();
              const randomString = Math.random().toString(36).substring(2, 8);
              const guestEmail = `guest_${timestamp}_${randomString}@guest.kugy.ai`;

              const response = await fetch(`${BACKEND_URL}/api/guest-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: guestEmail }),
              });
              
              const data = await response.json();
              if (response.ok && data.token) {
                sessionStorage.setItem("token", data.token);
                localStorage.setItem("user_email", guestEmail);
                localStorage.setItem("user_credits", "25");
                router.push(`/menu?email=${encodeURIComponent(guestEmail)}&credits=25`);
              } else {
                throw new Error(data.error || "Failed to login as guest");
              }
            } catch (error) {
              console.error("Guest login error:", error);
              setError("Failed to login as guest");
              
              // Fallback untuk development
              if (process.env.NODE_ENV === 'development') {
                const timestamp = Date.now();
                const randomString = Math.random().toString(36).substring(2, 8);
                const fallbackEmail = `guest_${timestamp}_${randomString}@guest.kugy.ai`;
                const dummyToken = "guest-token-" + Math.random().toString(36).substring(7);
                
                sessionStorage.setItem("token", dummyToken);
                localStorage.setItem("user_email", fallbackEmail);
                localStorage.setItem("user_credits", "25");
                router.push(`/menu?email=${encodeURIComponent(fallbackEmail)}&credits=25`);
              }
            } finally {
              setLoading(false);
            }
          }}
          loading={loading}
          error={error}
          bgStyle={darkMode ? darkBg : animeBg}
        />
      </>
    );
  }

  return null;
};

export default IndexPage;
