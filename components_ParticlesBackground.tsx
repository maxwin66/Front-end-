import React from "react";

const ParticlesBackground: React.FC<{ darkMode?: boolean }> = ({ darkMode }) => (
  <div className="pointer-events-none fixed inset-0 z-0">
    <svg width="100%" height="100%">
      {[...Array(30)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100 + "%"}
          cy={Math.random() * 100 + "%"}
          r={Math.random() * 1.8 + 0.5}
          fill={darkMode ? "#a5b4fc" : "#fff"}
          opacity={Math.random() * 0.7 + 0.2}
        />
      ))}
    </svg>
  </div>
);

export default ParticlesBackground;