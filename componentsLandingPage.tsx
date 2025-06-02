import React from "react";

interface LandingPageProps {
  onLogin: () => void;
  onGuest: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onGuest }) => {
  return (
    <div className="landing-anime-bg">
      <div className="welcome-box">
        <h1>
          <span style={{ color: "#3ca6ff" }}>Selamat Datang di MyKugy!</span>
        </h1>
        <p style={{ margin: "12px 0" }}>
          Asisten virtual imut dengan sentuhan biru dan nuansa anime.<br />
          Mulai dengan mode tamu (20 kredit), atau daftar untuk fitur dan kredit lebih banyak (75 kredit)!
        </p>
        <div style={{ margin: "24px 0 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn-main" onClick={onLogin}>
            Mulai
          </button>
          <button className="btn-guest" onClick={onGuest}>
            Mulai sebagai Tamu
          </button>
        </div>
        <div style={{ color: "#567", fontSize: "0.95em" }}>
          <b>Fitur Menarik:</b> Coba Face Swap, Buat Gambar, Chatting AI, dan banyak lagi!<br />
          <span style={{ fontSize: "0.8em" }}>
            Aktifkan fitur ini setelah masuk mode tamu atau daftar!
          </span>
        </div>
      </div>
      <style jsx>{`
        .landing-anime-bg {
          min-height: 100vh;
          background: url('https://user-images.githubusercontent.com/107878113/321337217-6f05d6a6-9e94-4188-8f6f-2c0ef8b8d7b2.jpg') center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .welcome-box {
          background: rgba(255,255,255,0.88);
          border-radius: 16px;
          max-width: 400px;
          margin: auto;
          padding: 34px 22px 24px 22px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          text-align: center;
        }
        .btn-main {
          background: linear-gradient(90deg,#25aae1,#40e495);
          color: white;
          border: none;
          padding: 13px 0;
          border-radius: 9px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          margin-bottom: 2px;
        }
        .btn-guest {
          background: #fff;
          border: 2px solid #3ca6ff;
          color: #3ca6ff;
          border-radius: 9px;
          font-size: 1.1em;
          font-weight: bold;
          padding: 13px 0;
          cursor: pointer;
          width: 100%;
        }
        @media (max-width: 600px) {
          .welcome-box {
            max-width: 94vw;
            padding: 20px 2vw 16px 2vw;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;