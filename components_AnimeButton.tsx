import React from "react";

export default function AnimeButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`
        w-full py-4 mb-4 rounded-2xl font-bold text-white text-lg
        bg-gradient-to-r from-pink-400 via-blue-400 to-purple-500
        shadow-[0_0_16px_4px_rgba(137,88,255,0.3)]
        border-[3px] border-white/50
        transition-all duration-300
        hover:scale-105 hover:shadow-[0_0_32px_8px_rgba(137,88,255,0.7)]
        relative overflow-hidden
        animate-glow
        font-[M_PLUS_Rounded_1c,sans-serif]
      `}
      style={{
        letterSpacing: "2px",
        textShadow: "0 2px 8px #fff8, 0 0 12px #a5b4fc99",
      }}
    >
      {/* Sparkle SVG dekorasi */}
      <span className="absolute left-3 top-2 animate-spin-slow opacity-60">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 1L12 8L19 10L12 12L10 19L8 12L1 10L8 8L10 1Z" fill="#fffbe6" />
        </svg>
      </span>
      {children}
      <span className="absolute right-3 bottom-2 animate-ping opacity-50">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="4" fill="#a5b4fc" />
        </svg>
      </span>
    </button>
  );
}