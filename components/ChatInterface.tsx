import { useContext, useState, useRef, useEffect } from "react";
import { UiContext } from "../pages/_app";

export default function ChatInterface({ email, isGuest, credits, bgStyle }: any) {
  const { theme, darkMode, lang } = useContext(UiContext);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: lang === "id" ? "Halo! Ada yang bisa aku bantu?" : lang === "en" ? "Hello! How can I help you?" : "こんにちは！どうしたの？" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);      

  // Kredit handling
  const [userCredits, setUserCredits] = useState(isGuest ? 20 : credits);
  useEffect(() => { 
    setUserCredits(isGuest ? 20 : credits); 
  }, [credits, isGuest]);

  // --- Guest ID persist ---
  const [guestId, setGuestId] = useState("");
  useEffect(() => {
    if (isGuest) {
      let gid = sessionStorage.getItem("guest_id");
      if (!gid) {
        gid = "guest-" + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem("guest_id", gid);
      }
      setGuestId(gid);
    }
  }, [isGuest]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!value.trim() || loading || userCredits <= 0 || (isGuest && !guestId)) return;
    const userMsg = { from: "user", text: value };
    setMessages(prev => [...prev, userMsg]);
    setValue("");
    setLoading(true);
    setUserCredits(cr => Math.max(0, cr - 1)); // Pastikan tidak negatif

    let user_email = email && email.trim() !== "" ? email : guestId;
    console.log("handleSend user_email:", user_email, "isGuest:", isGuest, "email:", email, "guestId:", guestId);

    try {
      const res = await fetch("https://backend-cb98.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email,
          message: userMsg.text,
          model_select: "x-ai/grok-3-mini-beta"
        })
      });
      if (!res.ok) {
        throw new Error("API error " + res.status);
      }
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { from: "ai", text: (data.reply || "Maaf, AI tidak bisa menjawab sekarang.") }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { from: "ai", text: "Maaf, terjadi error koneksi ke server. Coba lagi nanti." }
      ]);
      setUserCredits(cr => cr + 1); // Kembalikan kredit jika terjadi error
    }
    setLoading(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={bgStyle}
    >
      {/* Logo dan Judul */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 mb-2">
          <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4f46e5' }} />
                <stop offset="100%" style={{ stopColor: '#7c3aed' }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Background circle */}
            <circle cx="12" cy="12" r="11" fill="url(#logoGradient)" />
            
            {/* Anime robot face */}
            <g filter="url(#glow)">
              {/* Eyes */}
              <circle cx="8" cy="10" r="1.8" fill="white" />
              <circle cx="16" cy="10" r="1.8" fill="white" />
              <circle cx="8" cy="10" r="0.8" fill="#4f46e5" />
              <circle cx="16" cy="10" r="0.8" fill="#4f46e5" />
              
              {/* Smile */}
              <path
                d="M8 14.5 C10 17, 14 17, 16 14.5"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Antenna */}
              <path
                d="M12 4 L12 7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="3" r="1" fill="white" />
            </g>
          </svg>
        </div>
        <div
          className="text-xl font-bold text-center"
          style={{ color: theme.color }}
        >
          MyKugy AI Chat
        </div>
      </div>

      <div
        className="w-full max-w-sm bg-white/60 rounded-2xl p-4 shadow mb-4 flex flex-col"
        style={{
          minHeight: 250,
          maxHeight: "70vh",
          overflowY: "auto",
          margin: "0 auto"
        }}
      >
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pb-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} w-full`}
            >
              <div
                className={`
                  rounded-2xl px-4 py-2 break-words shadow
                  ${msg.from === "user"
                    ? "text-white"
                    : "text-blue-900 bg-white/90 border border-blue-100"}
                `}
                style={{
                  display: "inline-block",
                  maxWidth: "85%",
                  width: "fit-content",
                  minWidth: "36px",
                  wordBreak: "break-word",
                  background: msg.from === "user"
                    ? `linear-gradient(to right, ${theme.color}, ${theme.color}cc)`
                    : undefined,
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="flex-1 rounded-full px-4 py-2 border"
            placeholder={lang === "id" ? "Ketik pesan..." : lang === "en" ? "Type a message..." : "メッセージを入力..."}
            onKeyDown={handleKeyDown}
            disabled={loading || userCredits <= 0 || (isGuest && !guestId)}
            autoFocus
          />
          <button
            className={`px-6 py-2 rounded-full font-bold bg-gradient-to-r ${theme.gradient} text-white shadow transition`}
            onClick={handleSend}
            style={{ letterSpacing: '1px' }}
            disabled={loading || !value.trim() || userCredits <= 0 || (isGuest && !guestId)}
          >
            {loading
              ? (lang === "id" ? "..." : lang === "en" ? "..." : "...")
              : lang === "id" ? "Kirim" : lang === "en" ? "Send" : "送信"}
          </button>
        </div>
        {/* Badge email/guest & kredit */}
        <div className="flex flex-col items-center mt-5 mb-1">
          {email && !isGuest && (
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white font-semibold text-xs shadow-lg border border-white/30 select-text mb-1"
              style={{ letterSpacing: "0.5px", boxShadow: "0 2px 8px #1e3a8a50" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="inline mr-1" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v.511l8 6.222 8-6.222V6H4zm16 2.489l-7.445 5.792a2 2 0 01-2.11 0L4 8.489V18h16V8.489z"/></svg>
              {email}
            </span>
          )}
          {isGuest && (
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-gray-500 via-gray-700 to-gray-900 text-white font-semibold text-xs shadow-lg border border-white/20 mb-1"
              style={{ letterSpacing: "0.5px", boxShadow: "0 2px 8px #4446" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="inline mr-1" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              Guest Mode
            </span>
          )}
          <span className="inline-block mt-1 px-3 py-1 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs font-semibold shadow-sm">
            Kredit: {userCredits}
          </span>
        </div>
      </div>
    </div>
  );
            }
