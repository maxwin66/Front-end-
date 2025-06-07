import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import HomeSelect from "../components/HomeSelect";
import ParticlesBackground from "../components/ParticlesBackground";
import ThemeLangSwitcher from "../components/ThemeLangSwitcher";
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
  id: {
    start: "Mulai",
    carousel: [
      "🎁 Gratis 75 Kredit untuk Pengguna Baru!",
      "🚀 Login dengan Google atau Sebagai Tamu",
      "💬 Chat AI Karakter Anime 24/7",
      "✨ Privasi Aman & Tampilan Premium",
    ],
    version: "Versi",
    developed: "Dikembangkan dengan",
    by: "oleh",
  },
  en: {
    start: "Start",
    carousel: [
      "🎁 75 Free Credits for New Users!",
      "🚀 Login with Google or as Guest",
      "💬 Chat with Anime AI 24/7",
      "✨ Secure Privacy & Premium Appearance",
    ],
    version: "Version",
    developed: "Developed with",
    by: "by",
  },
  jp: {
    start: "スタート",
    carousel: [
      "🎁 新規ユーザーに75クレジット無料！",
      "🚀 Googleでログインまたはゲスト利用",
      "💬 24時間アニメAIチャット",
      "✨ 安全なプライバシー＆プレミアムデザイン",
    ],
    version: "バージョン",
    developed: "開発：",
    by: "",
  },
};

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

  const { theme, darkMode, lang } = useContext(UiContext);

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
        setFeatureIdx((i) => (i + 1) % texts[lang].carousel.length);
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
  }, [step, lang]);

  useEffect(() => {
    if (step !== "start") return;
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % animeQuotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [step]);

  const handleStart = () => {
    console.log("Start button clicked, blurTrans:", blurTrans);
    setBlurTrans(true);
    setTimeout(() => {
      console.log("Transition complete, setting step to select");
      setBlurTrans(false);
      setStep("select");
    }, 450);
  };

  useEffect(() => {
    if (step !== "start") return;
    document.body.style.cursor = "url('/star-cursor.png'), auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [step]);

  if (step === "start") {
    return (
      <div
        className={`flex flex-col min-h-screen relative overflow-hidden transition-colors duration-500`}
        style={
          darkMode
            ? darkBg
            : { ...animeBg, backgroundPosition: `${50 + parallax.x}% ${50 + parallax.y}%` }
        }
      >
        <ParticlesBackground darkMode={darkMode} />
        <ThemeLangSwitcher />

        <div className="absolute left-1/2 transform -translate-x-1/2 top-8 z-10">
          <span className={`bg-gradient-to-r ${theme.gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
            Beta
          </span>
        </div>

        <div className="absolute top-14 left-0 right-0 flex flex-col items-center z-10">
          <div
            className="text-2xl font-extrabold drop-shadow-lg tracking-wider"
            style={{ color: theme.color, textShadow: "0 2px 8px #0369a1cc" }}
          >
            MyKugy Ai Chat Anime
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div
            className={`bg-white/30 ${darkMode ? "bg-opacity-10" : "backdrop-blur-2xl"} rounded-3xl shadow-2xl p-8 flex flex-col items-center min-w-[320px] max-w-[94vw] w-full mx-2 border border-blue-200/50 dark:border-slate-600/30 relative animate-glow`}
          >
            <div className="mb-6 w-full">
              <div className="text-md" style={{ color: theme.color, fontWeight: 700, textAlign: "center" }}>
                {texts[lang].carousel[featureIdx]}
              </div>
              <div className="w-full h-1 bg-blue-100 rounded-full mt-1">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${carouselProg}%`, background: theme.color }}
                />
              </div>
            </div>

            <button
              className={`px-16 py-4 text-2xl rounded-full font-bold bg-gradient-to-r ${theme.gradient} shadow-xl text-white hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent`}
              onClick={handleStart}
              disabled={blurTrans}
            >
              {texts[lang].start}
            </button>

            {blurTrans && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-3xl transition-all duration-300" />
            )}

            <style>{`
              .animate-glow {
                box-shadow: 0 0 20px 3px ${theme.color}80, 0 0 40px 7px ${theme.color}60;
                transition: box-shadow 0.3s;
              }
              .animate-glow:hover {
                box-shadow: 0 0 36px 10px ${theme.color}88, 0 0 72px 12px ${theme.color}80;
              }
            `}</style>

            <div className="mt-7 mb-2 w-full flex flex-col items-center">
              <div className="text-xs italic text-blue-900 text-center max-w-xs transition-all duration-500">
                "{animeQuotes[quoteIdx].text}"{" "}
                <span className="not-italic font-bold text-blue-600">- {animeQuotes[quoteIdx].author}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 w-full flex flex-col items-center z-10 text-xs text-white/80">
          <div className="mb-1 flex gap-2">
            <span className={`bg-blue-300/80 text-sky-800 px-2 py-0.5 rounded font-bold text-xs`}>
              {texts[lang].version} v1.0.0 Beta
            </span>
            <span>|</span>
            <a href="https://instagram.com/yourbrand" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">
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
            {texts[lang].developed} <span className="text-pink-300">❤️</span> {texts[lang].by}{" "}
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
        <ThemeLangSwitcher />
        <HomeSelect
          onGoogle={() => {
            if (typeof window !== "undefined") {
              window.location.href = "https://backend-cb98.onrender.com/auth/google";
            }
          }}
          onGuest={async () => {
            const guestEmail = `guest_${Math.random().toString(36).substr(2, 9)}@guest.com`;
            try {
              const response = await fetch("https://backend-cb98.onrender.com/api/guest-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: guestEmail }),
              });
              const data = await response.json();
              if (data.token) {
                console.log("Guest login success, token:", data.token);
                sessionStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({ email: guestEmail, isGuest: true }));
                router.push(`/menu?guest=1&email=${encodeURIComponent(guestEmail)}`);
              } else {
                console.error("No token from guest login, response:", data);
                const dummyToken = "guest-token-" + guestEmail;
                console.log("Using dummy token:", dummyToken);
                sessionStorage.setItem("token", dummyToken);
                localStorage.setItem("user", JSON.stringify({ email: guestEmail, isGuest: true }));
                router.push(`/menu?guest=1&email=${encodeURIComponent(guestEmail)}`);
              }
            } catch (error) {
              console.error("Guest login error:", error);
              const dummyToken = "guest-token-" + guestEmail;
              console.log("API error, using dummy token:", dummyToken);
              sessionStorage.setItem("token", dummyToken);
              localStorage.setItem("user", JSON.stringify({ email: guestEmail, isGuest: true }));
              router.push(`/menu?guest=1&email=${encodeURIComponent(guestEmail)}`);
            }
          }}
          bgStyle={darkMode ? darkBg : animeBg}
        />
      </>
    );
  }

  return null;
};

export default IndexPage;
