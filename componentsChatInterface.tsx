import React from "react";

interface ChatInterfaceProps {
  email: string;
  isGuest: boolean;
  credits: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ email, isGuest, credits }) => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f8ff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start"
    }}>
      <div style={{
        marginTop: 48,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 1px 8px rgba(0,0,0,0.10)",
        padding: 24,
        maxWidth: 400,
        width: "94vw",
        minHeight: 220
      }}>
        <div style={{ fontWeight: "bold", color: "#3ca6ff", marginBottom: 8 }}>
          MyKugy - AI Chat Anime
        </div>
        <div style={{ fontSize: "0.98em", marginBottom: 8 }}>
          {isGuest
            ? <>Mode Tamu (20 kredit)</>
            : <>Login sebagai <b>{email}</b> (75 kredit)</>
          }
        </div>
        {/* Tambahkan form chat dan history chat di sini */}
        <div style={{ marginTop: 18, fontSize: "0.93em", color: "#888" }}>
          Kredit tersisa: <b>{credits}</b>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;