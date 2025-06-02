import { useState } from "react";
import HomeSelect from "../components/HomeSelect";
import ChatInterface from "../components/ChatInterface";

const IndexPage = () => {
  const [step, setStep] = useState<"start" | "select" | "guest" | "login">("start");
  const [credits, setCredits] = useState(0);
  const [email, setEmail] = useState("");

  // Simulasi login Google
  const handleGoogleLogin = () => {
    // Di produksi, redirect ke backend Google OAuth dan set email user dari backend
    setStep("login");
    setCredits(75);
    setEmail("kamu@email.com"); // replace sesuai hasil login backend
  };

  const handleGuest = () => {
    setStep("guest");
    setCredits(20);
    setEmail(""); // mode tamu tidak ada email
  };

  // Step 1: Halaman awal, hanya 1 tombol "Mulai"
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

  // Step 3: Halaman chat AI, background anime
  return (
    <ChatInterface
      email={email}
      isGuest={step === "guest"}
      credits={credits}
    />
  );
};

export default IndexPage;
