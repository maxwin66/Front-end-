import { useState } from "react";
import HomeSelect from "../components/HomeSelect";
import ChatInterface from "../components/ChatInterface";

const IndexPage = () => {
  // Tambahkan "login" di tipe step!
  const [step, setStep] = useState<"start" | "select" | "guest" | "login">("start");
  const [credits, setCredits] = useState(0);
  const [email, setEmail] = useState("");

  // Handler: Google login
  const handleGoogleLogin = () => {
    window.location.href = "https://backend-bpup.onrender.com/auth/google";
  };

  const handleGuest = () => {
    setStep("guest");
    setCredits(20);
    setEmail("");
  };

  if (typeof window !== "undefined" && step !== "login") {
    const params = new URLSearchParams(window.location.search);
    const gotEmail = params.get("email");
    if (gotEmail && step !== "login") {
      setEmail(gotEmail);
      setStep("login");
      setCredits(75);
      window.history.replaceState({}, document.title, "/");
    }
  }

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
