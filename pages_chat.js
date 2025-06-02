import { useState } from "react";
import useGoogleLoginEffect from "../hooks/useGoogleLoginEffect";

export default function Chat() {
  useGoogleLoginEffect();
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const email = typeof window !== "undefined" ? localStorage.getItem("user_email") : "";

  const sendChat = async () => {
    setReply("...");
    const res = await fetch("https://backend-cb98.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: email, message: msg }),
    });
    const data = await res.json();
    setReply(data.reply || data.error);
  };

  if (!email) {
    return (
      <div>
        <p>Belum login. <a href="/">Klik untuk login dulu</a></p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>KugyAI - Chat AI</h1>
      <p>Login sebagai <b>{email}</b></p>
      <input
        value={msg}
        onChange={e => setMsg(e.target.value)}
        placeholder="Tulis pertanyaan kamu..."
        style={{ width: "60%" }}
      />
      <button onClick={sendChat}>Kirim</button>
      <div style={{ marginTop: 20 }}>
        <b>AI:</b> {reply}
      </div>
    </div>
  );
}