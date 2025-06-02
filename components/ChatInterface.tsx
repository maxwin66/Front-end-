import React, { useState, useRef, useEffect } from "react";

interface ChatInterfaceProps {
  email: string;
  isGuest: boolean;
  credits: number;
  bgStyle?: React.CSSProperties;
}

interface ChatItem {
  role: "user" | "ai";
  content: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  email,
  isGuest,
  credits: initialCredits,
  bgStyle,
}) => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(initialCredits);

  // Ref untuk auto-scroll ke bawah
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim() || credits <= 0) return;
    const question = input.trim();
    setChat([...chat, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://backend-cb98.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: isGuest ? "" : email,
          message: question,
          model_select: "OpenRouter (Grok 3 Mini Beta)",
        }),
      });
      if (!res.ok) throw new Error("Gagal response");
      const data = await res.json();
      setChat((prev) => [...prev, { role: "ai", content: data.reply }]);
      setCredits(Number(data.credits));
    } catch (e) {
      setChat((prev) => [
        ...prev,
        { role: "ai", content: "Maaf, AI sedang tidak bisa merespon." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={bgStyle}
    >
      <div className="bg-white/95 p-6 rounded-2xl shadow-xl max-w-2xl w-full min-h-[520px]">
        <div className="font-bold text-blue-500 mb-1">
          MyKugy - AI Chat Anime
        </div>
        <div className="mb-2">
          {isGuest
            ? (
              <>Mode Tamu <span className="text-sm text-gray-500">(20 kredit)</span></>
            )
            : (
              <>Login sebagai <b>{email}</b> <span className="text-sm text-gray-500">(75 kredit)</span></>
            )}
        </div>
        <div className="mb-2 min-h-[300px] max-h-[420px] overflow-y-auto bg-blue-50 rounded-lg px-2 py-1">
          {chat.length === 0 && (
            <div className="text-gray-400">Tanyakan apapun ke AI MyKugy di sini!</div>
          )}
          {chat.map((item, idx) => (
            <div
              key={idx}
              className={item.role === "user" ? "text-right" : "text-left"}
            >
              <span className={item.role === "user"
                ? "inline-block bg-blue-200 rounded-lg px-2 py-1 my-1"
                : "inline-block bg-green-100 rounded-lg px-2 py-1 my-1"
              }>
                <b>{item.role === "user" ? "Kamu" : "AI"}:</b> {item.content}
              </span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 rounded-lg border border-blue-200 px-3 py-2"
            disabled={loading || credits <= 0}
            value={input}
            placeholder={credits <= 0 ? "Kredit habis" : "Tulis pertanyaan kamu..."}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          />
          <button
            className="rounded-lg bg-gradient-to-r from-blue-400 to-green-300 text-white font-bold px-5 py-2 disabled:opacity-60"
            disabled={loading || credits <= 0}
            onClick={handleSend}
          >
            {loading ? "..." : "Kirim"}
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Kredit tersisa: <b>{credits}</b>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
