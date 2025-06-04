import React from "react";
import { useRouter } from "next/router";

interface Props {
  onGoogle?: () => void;
  bgStyle?: React.CSSProperties;
}

const HomeSelect: React.FC<Props> = ({ onGoogle, bgStyle }) => {
  const router = useRouter();

  // DEBUG LOG
  console.log("Render HomeSelect COMPONENT");

  return (
    <div style={bgStyle}>
      <button onClick={() => { console.log("Google btn"); onGoogle && onGoogle(); }}>Google</button>
      <button
        id="guest-btn"
        style={{ background: "yellow", color: "black", fontWeight: "bold", marginLeft: 20 }}
        onClick={() => {
          console.log("Guest button clicked!");
          router.push("/?openchat=1");
        }}
      >
        Guest
      </button>
    </div>
  );
};

export default HomeSelect;
