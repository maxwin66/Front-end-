import { useContext, useState } from "react";
import { UiContext } from "../pages/_app";

// Contoh chat sederhana
export default function ChatInterface({ email, isGuest, credits, bgStyle }: any) {
  const { theme, darkMode, lang } = useContext(UiContext);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: "Halo! Ada yang bisa aku bantu?" }
  ]);

  const handleSend = () => {
    if (!value.trim()) return;
    setMessages([...messages, { from: "user", text: value }]);
    setValue("");
    // Simulasi balasan AI
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { from: "ai", text: "Aku AI Anime siap menemani chatmu!" }
      ]);
    }, 500);
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
      <div className="w-full max-w-lg bg-white/60 rounded-2xl p-4 shadow mb-4 flex-1 flex flex-col"
        style={{ minHeight: 400 }}
      >
        <div className="flex-1 space-y-2 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-xl px-4 py-2 max-w-xs ${
                  msg.from === "user"
                    ? "bg-gradient-to-r text-white"
                    : "bg-white text-blue-900"
                }`}
                style={
                  msg.from === "user"
                    ? {
                        background: `linear-gradient(to right, ${theme.color}, ${theme.color}CC)`,
                      }
                    : {}
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="flex-1 rounded-full px-4 py-2 border"
            placeholder={lang === "id" ? "Ketik pesan..." : lang === "en" ? "Type a message..." : "メッセージを入力..."}
          />
          <button
            className={`px-6 py-2 rounded-full font-bold bg-gradient-to-r ${theme.gradient} text-white shadow transition`}
            onClick={handleSend}
            style={{ letterSpacing: '1px' }}
          >
            {lang === "id" ? "Kirim" : lang === "en" ? "Send" : "送信"}
          </button>
        </div>
      </div>
      <div className="text-xs text-blue-900/70 mb-2">
        {isGuest ? "Mode Tamu" : email} | Kredit: {credits}
      </div>
    </div>
  );
}
