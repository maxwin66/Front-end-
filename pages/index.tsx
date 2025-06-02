import { useState, useEffect } from "react";
import HomeSelect from "../components/HomeSelect";
import ChatInterface from "../components/ChatInterface";

type Step = "start" | "select" | "guest" | "login";

const IndexPage = () => {
  const [step, setStep] = useState<Step>("start");
  const [credits, setCredits] = useState(0);
  const [email, setEmail] = useState("");

  // Handler: Google login
  const handleGoogleLogin = () => {
    if (typeof window !== "undefined") {
      window.location.href = "https://backend-bpup.onrender.com/auth/google";
    }
  };

  // Handler: guest mode langsung jalan
  const handleGuest = () => {
    setStep("guest");
    setCredits(20);
    setEmail("");
  };

  // Deteksi redirect dari backend setelah login Google (ambil email dari query param)
  useEffect(() => {
    if (typeof window !== "undefined" && step === "start") {
      const params = new URLSearchParams(window.location.search);
      const gotEmail = params.get("email");
      if (gotEmail) {
        setEmail(gotEmail);
        setStep("login");
        setCredits(75);
        // Bersihkan query agar tidak muncul lagi saat reload
        window.history.replaceState({}, document.title, "/");
      }
    }
  }, [step]);

  if (step === "start") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
      />
    );
  }

  return (
    <ChatInterface
      email={email}
      isGuest={step === "guest"}
      credits={credits}
    />
  );
};

export default IndexPage;