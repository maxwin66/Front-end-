import { useState, useEffect } from "react";
import LandingPage from "../components/LandingPage";
import ChatInterface from "../components/ChatInterface";

const Home = () => {
  const [mode, setMode] = useState<"" | "guest" | "user">("");
  const [email, setEmail] = useState<string>("");
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gotEmail = params.get("email");
    if (gotEmail) {
      setEmail(gotEmail);
      setMode("user");
      setCredits(75);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "https://backend-bpup.onrender.com/auth/google";
  };

  const handleGuest = () => {
    setMode("guest");
    setCredits(20);
  };

  if (mode === "user" || mode === "guest") {
    return (
      <ChatInterface
        email={email}
        isGuest={mode === "guest"}
        credits={credits}
      />
    );
  }

  return (
    <LandingPage onLogin={handleLogin} onGuest={handleGuest} />
  );
};

export default Home;
