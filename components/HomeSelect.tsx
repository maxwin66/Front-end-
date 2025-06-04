import React from "react";
import { useRouter } from "next/router";

interface Props {
  onGoogle?: () => void;
  bgStyle?: React.CSSProperties;
}

const HomeSelect: React.FC<Props> = ({ onGoogle, bgStyle }) => {
  const router = useRouter();

  return (
    <div style={{ padding: 24, ...bgStyle }}>
      <button
        style={{
          background: "#4285F4",
          color: "white",
          fontWeight: "bold",
          padding: "12px 24px",
          borderRadius: 8,
          marginRight: 12,
          border: "none",
          fontSize: 16,
        }}
        onClick={onGoogle}
      >
        Google
      </button>
      <button
        style={{
          background: "yellow",
          color: "#222",
          fontWeight: "bold",
          padding: "12px 24px",
          borderRadius: 8,
          border: "2px solid #ffd700",
          fontSize: 16,
        }}
        onClick={() => router.push("/?openchat=1")}
      >
        Guest
      </button>
    </div>
  );
};

export default HomeSelect;
