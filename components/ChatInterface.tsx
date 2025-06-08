import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  email: string;
  initialCredits?: number;
  darkMode?: boolean;
}

const BACKEND_URL = "https://backend-cb98.onrender.com";

// Background styles
const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat fixed",
  minHeight: "100vh",
};

const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh",
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ email, initialCredits = 0, darkMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(initialCredits);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: email,
          message: userMessage,
          model_select: "OpenRouter (Grok 3 Mini Beta)"
        }),
      });

      if (response.status === 402) {
        alert('Kredit Anda habis! Silakan login dengan Google untuk mendapatkan kredit tambahan.');
        router.push('/');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        setCredits(parseInt(data.credits));
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen" style={darkMode ? darkBg : animeBg}>
      <div className="p-4 bg-blue-500/90 backdrop-blur-sm dark:bg-blue-600/90 text-white">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Chat with AI</h1>
          <div className="text-sm">Credits: {credits}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg backdrop-blur-md ${
                msg.role === 'user'
                  ? 'bg-blue-100/90 dark:bg-blue-900/90 ml-auto max-w-[80%]'
                  : 'bg-white/90 dark:bg-gray-800/90 max-w-[80%]'
              } shadow-lg`}
            >
              <div className={`text-${msg.role === 'user' ? 'blue-800' : 'gray-800'} dark:text-white`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t dark:border-gray-700">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={loading ? "AI sedang mengetik..." : "Ketik pesan Anda..."}
            className="flex-1 p-2 border rounded-lg bg-white/80 dark:bg-gray-700/80 dark:border-gray-600 dark:text-white backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            {loading ? "..." : "Kirim"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
