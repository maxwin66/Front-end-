import { useState, useEffect, useRef, useContext } from "react";
import { UiContext } from "../pages/_app";
import Image from "next/image";
import { useRouter } from "next/router";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  email: string;
  isGuest: boolean;
  credits: number;
  bgStyle?: React.CSSProperties;
}

const ChatInterface: React.FC<Props> = ({ 
  email, 
  isGuest, 
  credits: initialCredits 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(initialCredits);
  const [model, setModel] = useState("OpenRouter (Grok 3 Mini Beta)");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, darkMode, lang } = useContext(UiContext);

  const animeBg = {
    backgroundImage: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%"
  };

  const darkBg = {
    background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
    minHeight: "100vh",
    width: "100%",
    backgroundAttachment: "fixed"
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `https://backend-cb98.onrender.com/api/history?user_email=${email}`,
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(
            data.history.map((h: any) => [
              { role: "user", content: h.question },
              { role: "assistant", content: h.answer },
            ]).flat()
          );
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    if (email) fetchHistory();
  }, [email]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("https://backend-cb98.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email,
          message: userMessage,
          model_select: model
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        setCredits(parseInt(data.credits));
      } else {
        if (data.error === "NOT_ENOUGH_CREDITS") {
          setMessages(prev => [
            ...prev,
            {
              role: "assistant",
              content: "Maaf, kredit kamu tidak cukup! Silakan top up atau login dengan Google untuk kredit tambahan."
            }
          ]);
        } else {
          throw new Error(data.error);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi nanti."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image Container */}
      <div 
        className="fixed inset-0 z-0" 
        style={darkMode ? darkBg : animeBg}
      />
      
      {/* Overlay gradient untuk background */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/10 to-black/30 dark:from-black/30 dark:to-black/50 z-0" />

      {/* Content wrapper */}
      <div className="relative flex flex-col min-h-screen z-10">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Image
                  src="/logo.png"
                  alt="MyKugy Logo"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-blue-500 p-0.5"
                />
                <div>
                  <h1 className="font-bold text-gray-800 dark:text-white text-lg">
                    {isGuest ? "Guest Mode" : email}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Credits:
                    </span>
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                      {credits}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-700/90 border border-blue-300 dark:border-blue-500 text-sm font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OpenRouter (Grok 3 Mini Beta)">Grok 3 Mini</option>
                  <option value="OpenRouter (Gemini 2.0 Flash)">Gemini 2.0</option>
                </select>
                <button
                  onClick={() => router.push("/")}
                  className="px-4 py-1.5 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm hover:shadow-md transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white backdrop-blur-sm border border-white/20"
                  } shadow-lg`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl px-4 py-2.5 shadow-lg backdrop-blur-sm border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 dark:bg-gray-800/90 shadow-lg backdrop-blur-md border-t border-white/20 p-4">
          <div className="max-w-3xl mx-auto flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                lang === "id"
                  ? "Ketik pesanmu di sini..."
                  : lang === "en"
                  ? "Type your message here..."
                  : "メッセージを入力..."
              }
              className="flex-1 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/90 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !inputMessage.trim()}
              className={`px-6 py-3 rounded-xl font-medium text-white transition-all ${
                loading || !inputMessage.trim()
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:scale-105"
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: "150ms"}} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: "300ms"}} />
                </div>
              ) : (
                lang === "id" ? "Kirim" : lang === "en" ? "Send" : "送信"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
