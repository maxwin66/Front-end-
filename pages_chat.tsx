import { useState, useEffect, useContext } from "react";
import ChatInterface from "../components/ChatInterface";
import ThemeLangSwitcher from "../components/ThemeLangSwitcher";
import { UiContext } from "./_app";

const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat",
  minHeight: "100vh"
};
const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh"
};

const ChatPage = () => {
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState(75);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const gotEmail = params.get("email");
      const guest = params.get("guest");
      if (gotEmail) {
        setEmail(gotEmail);
        setIsGuest(false);
      } else if (guest === "1") {
        setIsGuest(true);
        setEmail("");
      }
    }
  }, []);

  const { theme, darkMode } = useContext(UiContext);

  return (
    <>
      <ThemeLangSwitcher />
      <ChatInterface
        email={email}
        isGuest={isGuest}
        credits={credits}
        bgStyle={darkMode ? darkBg : animeBg}
      />
    </>
  );
};

export default ChatPage;