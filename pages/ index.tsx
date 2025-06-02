import { useState, useEffect } from "react";
import HomeSelect from "../components/HomeSelect";
import ChatInterface from "../components/ChatInterface";

type Step = "start" | "select" | "guest" | "login";

// Ganti dengan direct raw image link kamu!
const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat"
};

const IndexPage = () => {
  const [step, setStep] = useState<Step>("start");
  const [credits, setCredits] = useState(0);
  const [email, setEmail] = useState("");

  const handleGoogleLogin = () => {
    if (typeof window !== "undefined") {
      window.location.href = "https://backend-cb98.onrender.com/auth/google";
    }
  };

  const handleGuest = () => {
    setStep("guest");
    setCredits(20);
    setEmail("");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && step === "start") {
      const params = new URLSearchParams(window.location.search);
      const gotEmail = params.get("email");
      if (gotEmail) {
        setEmail(gotEmail);
        setStep("login");
        setCredits(75);
        window.history.replaceState({}, document.title, "/");
      }
    }
  }, [step]);

  if (step === "start") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={animeBg}>
        <button
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-green-300 text-white text-xl font-bold shadow-lg"
          onClick={() => setStep("select")}
        >
          Mulai
        </button>
      </div>
    );
  }

  if (step === "select") {
    return (
      <HomeSelect
        onGoogle={handleGoogleLogin}
        onGuest={handleGuest}
        bgStyle={animeBg}
      />
    );
  }

  return (
    <ChatInterface
      email={email}
      isGuest={step === "guest"}
      credits={credits}
      bgStyle={animeBg}
    />
  );
};

export default IndexPage;
