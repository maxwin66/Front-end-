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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!value.trim() || loading) return;
    const userMsg = { from: "user", text: value };
    setMessages(prev => [...prev, userMsg]);
    setValue("");
    setLoading(true);

    try {
      const res = await fetch("https://backend-cb98.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email || "",
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
      <div
        className="text-xl font-bold text-center my-4"
        style={{ color: theme.color }}
      >
        MyKugy Ai Chat Anime
      </div>
      <div
        className="w-full max-w-lg bg-white/60 rounded-2xl p-4 shadow mb-4 flex-1 flex flex-col"
        style={{ minHeight: 400, maxHeight: "70vh", overflowY: "auto" }}
      >
        <div className="flex-1 space-y-2 overflow-y-auto pb-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`w-full flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 break-words shadow
                  ${msg.from === "user"
                    ? "text-white"
                    : "text-blue-900 bg-white/90 border border-blue-100"}
                `}
                style={
                  msg.from === "user"
                    ? {
                        maxWidth: "70%",
                        background: `linear-gradient(to right, ${theme.color}, ${theme.color}CC)`
                      }
                    : { maxWidth: "70%" }
                }
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
            disabled={loading}
            autoFocus
          />
          <button
            className={`px-6 py-2 rounded-full font-bold bg-gradient-to-r ${theme.gradient} text-white shadow transition`}
            onClick={handleSend}
            style={{ letterSpacing: '1px' }}
            disabled={loading || !value.trim()}
          >
            {loading
              ? (lang === "id" ? "..." : lang === "en" ? "..." : "...")
              : lang === "id" ? "Kirim" : lang === "en" ? "Send" : "送信"}
          </button>
        </div>
      </div>
      <div className="text-xs text-blue-900/70 mb-2">
        {isGuest ? "Mode Tamu" : email} | Kredit: {credits}
      </div>
    </div>
  );
                                        }
