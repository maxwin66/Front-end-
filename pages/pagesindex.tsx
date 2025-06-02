import { useEffect, useState } from "react";
import Head from "next/head";

// Pakai gambar background dari repo kamu sendiri!
const ANIME_BG_URL = "https://raw.githubusercontent.com/Minatoz997/Front-end-/main/angel_background.png";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://98.onrender.com";

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      localStorage.setItem("user_email", emailParam);
      setEmail(emailParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const stored = localStorage.getItem("user_email");
      if (stored) setEmail(stored);
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const handleLogout = () => {
    localStorage.removeItem("user_email");
    setEmail(null);
    setReply("");
  };

  const sendChat = async () => {
    if (!msg.trim() || !email) return;
    setLoading(true);
    setReply("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: email, message: msg }),
      });
      const data = await res.json();
      setReply(data.reply || data.error || "Error");
    } catch {
      setReply("Network error.");
    }
    setLoading(false);
    setMsg("");
  };

  return (
    <>
      <Head>
        <title>MyKugy - AI Chat</title>
        <meta name="description" content="MyKugy, asisten AI imut dengan nuansa anime biru." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url('${ANIME_BG_URL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white/80 rounded-xl shadow-xl p-8 flex flex-col items-center max-w-md w-full mx-2 mt-16 mb-16">
          <h1 className="text-3xl font-bold mb-4 text-sky-500 drop-shadow font-sora text-center">MyKugy - AI Chat Anime</h1>
          {!email ? (
            <>
              <button
                onClick={handleGoogleLogin}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-bold shadow-md hover:scale-105 transform transition"
              >
                Login dengan Google
              </button>
            </>
          ) : (
            <>
              <div className="mb-2 text-sky-700 text-center">Login sebagai <b>{email}</b></div>
              <button
                onClick={handleLogout}
                className="mb-4 text-xs text-red-500 underline"
              >
                Logout
              </button>
              <div className="w-full flex">
                <input
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Tulis pertanyaan kamu..."
                  className="border px-4 py-2 rounded-l w-full"
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                  disabled={loading}
                />
                <button
                  onClick={sendChat}
                  disabled={loading || !msg.trim()}
                  className="bg-sky-500 text-white px-4 py-2 rounded-r font-bold"
                >
                  {loading ? "..." : "Kirim"}
                </button>
              </div>
              <div className="mt-6 w-full bg-white/90 p-3 rounded shadow min-h-[60px]">
                <b>AI:</b> <br />
                <span className="whitespace-pre-line">{reply}</span>
              </div>
            </>
          )}
        </div>
        <div className="text-white/60 text-sm mt-2 mb-4 drop-shadow text-center">
          © 2025 MyKugy. Powered by OpenRouter AI. <br />
          <span className="opacity-70">Tema anime hanya visual, bukan karakter asli</span>
        </div>
      </div>
    </>
  );
}