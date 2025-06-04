import React from "react";
import { useRouter } from "next/router";

interface Props {
  onGoogle?: () => void;
  bgStyle?: React.CSSProperties;
}

const HomeSelect: React.FC<Props> = ({ onGoogle, bgStyle }) => {
  const router = useRouter();

  // DEBUG: log agar tahu komponen dirender
  console.log("HomeSelect RENDERED!");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...bgStyle,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          boxShadow: "0 8px 32px #0002",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          minWidth: 320,
        }}
      >
        <button
          style={{
            background: "#4285F4",
            color: "white",
            fontWeight: "bold",
            padding: "18px 36px",
            borderRadius: 12,
            border: "none",
            fontSize: 20,
            marginBottom: 16,
            cursor: "pointer",
          }}
          onClick={onGoogle}
        >
          Login Google
        </button>
        <button
          style={{
            background: "yellow",
            color: "#222",
            fontWeight: "bold",
            padding: "18px 36px",
            borderRadius: 12,
            border: "2px solid #ffd700",
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() => {
            console.log("Guest button clicked!");
            router.push("/?openchat=1");
          }}
        >
          Masuk Sebagai Guest
        </button>
      </div>
    </div>
  );
};

export default HomeSelect;
