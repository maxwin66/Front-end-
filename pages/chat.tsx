import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router"; // Tambahkan import router
import ChatInterface from "../components/ChatInterface";
import ThemeLangSwitcher from "../components/ThemeLangSwitcher";
import { UiContext } from "./_app";
import GenerateImagePage from "./generate-image"; // Import GenerateImagePage

const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat",
  minHeight: "100vh"
};
const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh"
};

const ChatPage = () => {
  const router = useRouter(); // Initialize router
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const gotEmail = params.get("email");
      const guest = params.get("guest");
      
      if (gotEmail) {
        setEmail(gotEmail);
        setIsGuest(false);
        setCredits(75); // Set 75 credits for email login
      } else if (guest === "1") {
        setIsGuest(true);
        setEmail("");
        setCredits(20); // Set 20 credits for guest mode
      }
    }
  }, []);

  const { theme, darkMode } = useContext(UiContext);

  // Handle generate image button click
  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
  };

  // Handle back from generate image
  const handleBackFromGenerate = () => {
    setIsGeneratingImage(false);
  };

  // Handle credits update
  const handleCreditsUpdate = (newCredits: number) => {
    setCredits(newCredits);
  };

  // Show generate image page if isGeneratingImage is true
  if (isGeneratingImage) {
    return (
      <>
        <ThemeLangSwitcher />
        <GenerateImagePage 
          onBack={handleBackFromGenerate}
          email={email}
          credits={credits}
          onCreditsUpdate={handleCreditsUpdate}
        />
      </>
    );
  }

  // Main chat interface
  return (
    <>
      <ThemeLangSwitcher />
      <ChatInterface
        email={email}
        isGuest={isGuest}
        credits={credits}
        bgStyle={darkMode ? darkBg : animeBg}
        onGenerateImage={handleGenerateImage} // Add the required prop
      />
    </>
  );
};

export default ChatPage;
