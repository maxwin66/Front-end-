import { useState } from "react";
import HomeSelect from "../components/HomeSelect";
import ChatInterface from "../components/ChatInterface";

const IndexPage = () => {
  const [step, setStep] = useState<"start" | "select" | "guest" | "login">("start");
  const [credits, setCredits] = useState(0);
  const [email, setEmail] = useState("");

  // Handler: Google login
  const handleGoogleLogin = () => {
    // Redirect ke backend untuk login Google
    window.location.href = "https://backend-bpup.onrender.com/auth/google";
  };

  // Handler: guest mode langsung jalan
  const handleGuest = () => {
    setStep("guest");
    setCredits(20);
    setEmail(""); // guest tidak punya email
  };

  // Ketika backend redirect balik ke FE setelah login, tangkap email dari query (contoh: ?email=xxx)
  // Ini bisa diperbaiki jika backend-mu mengirim email user sebagai query param setelah login sukses.
  if (typeof window !== "undefined" && step !== "login") {
    const params = new URLSearchParams(window.location.search);
    const gotEmail = params.get("email");
    if (gotEmail && step !== "login") {
      setEmail(gotEmail);
      setStep("login");
      setCredits(75);
      // Hapus query biar ga muncul terus
      window.history.replaceState({}, document.title, "/");
    }
  }

  // Step 1: halaman awal
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

  // Step 2: Pilihan daftar/guest, background anime
  if (step === "select") {
    return (
      <HomeSelect
        onGoogle={handleGoogleLogin}
        onGuest={handleGuest}
      />
    );
  }

  // Step 3: Chat AI (mode login/guest), background anime
  return (
    <ChatInterface
      email={email}
      isGuest={step === "guest"}
      credits={credits}
    />
  );
};

export default IndexPage;
