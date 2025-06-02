import React, { useState } from "react";

interface ChatInterfaceProps {
  email: string;
  isGuest: boolean;
  credits: number;
}

interface ChatItem {
  role: "user" | "ai";
  content: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ email, isGuest, credits: initialCredits }) => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(initialCredits);

  // Ganti dengan fetch bawaan JS agar tanpa install library
  const handleSend = async () => {
    if (!input.trim() || credits <= 0) return;
    const question = input.trim();
    setChat([...chat, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://backend-bpup.onrender.com/api/chat", {
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
      style={{
        minHeight: "100vh",
        background: "url('https://user-images.githubusercontent.com/107878113/321337217-6f05d6a6-9e94-4188-8f6f-2c0ef8b8d7b2.jpg') center/cover no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          marginTop: 48,
          background: "rgba(255,255,255,0.96)",
          borderRadius: 16,
          boxShadow: "0 1px 8px rgba(0,0,0,0.10)",
          padding: 24,
          maxWidth: 400,
          width: "94vw",
        }}
      >
        <div style={{ fontWeight: "bold", color: "#3ca6ff", marginBottom: 8 }}>
          MyKugy - AI Chat Anime
        </div>
        <div style={{ fontSize: "0.98em", marginBottom: 8 }}>
          {isGuest
            ? <>Mode Tamu (20 kredit)</>
            : <>Login sebagai <b>{email}</b> (75 kredit)</>
          }
        </div>
        <div
          style={{
            minHeight: 120,
            maxHeight: 220,
            overflowY: "auto",
            marginBottom: 8,
            background: "#f4f8ff",
            borderRadius: 8,
            padding: 8,
          }}
        >
          {chat.length === 0 && (
            <div style={{ color: "#999", fontSize: "0.95em" }}>
              Tanyakan apapun ke AI MyKugy di sini!
            </div>
          )}
          {chat.map((item, idx) => (
            <div
              key={idx}
              style={{
                color: item.role === "user" ? "#222" : "#1d62c8",
                margin: "8px 0",
                textAlign: item.role === "user" ? "right" : "left",
                background: item.role === "user" ? "#e5f3ff" : "#e2fffa",
                borderRadius: 8,
                padding: 7,
                maxWidth: "95%",
                marginLeft: item.role === "user" ? "auto" : undefined,
                marginRight: item.role === "ai" ? "auto" : undefined,
                fontSize: "1em"
              }}
            >
              <b>{item.role === "user" ? "Kamu" : "AI"}:</b> {item.content}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            disabled={loading || credits <= 0}
            value={input}
            placeholder={
              credits <= 0
                ? "Kredit habis. Login untuk tambah kredit."
                : "Tulis pertanyaan kamu..."
            }
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              borderRadius: 8,
              border: "1.5px solid #c1e2f7",
              padding: "8px 10px"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            disabled={loading || credits <= 0}
            onClick={handleSend}
            style={{
              background: "linear-gradient(90deg,#25aae1,#40e495)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0 22px",
              fontWeight: "bold"
            }}
          >
            {loading ? "..." : "Kirim"}
          </button>
        </div>
        <div style={{ marginTop: 18, fontSize: "0.93em", color: "#888" }}>
          Kredit tersisa: <b>{credits}</b>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
