import { useState, useContext, useEffect } from 'react';
import { UiContext } from './_app';
import { useRouter } from 'next/router';
import useGoogleLoginEffect from '../hooks/useGoogleLoginEffect';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const BACKEND_URL = "https://backend-cb98.onrender.com";

const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat fixed",
  minHeight: "100vh",
};

const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh",
};

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { darkMode, lang } = useContext(UiContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number>(0); // Start with 0
  const [model, setModel] = useState('OpenRouter (Grok 3 Mini Beta)');

  useGoogleLoginEffect();

  const email = typeof window !== 'undefined' ? localStorage.getItem('user_email') : '';
  const isGuest = email?.includes('@guest.kugy.ai') || false;

  useEffect(() => {
    if (!email) {
      router.push('/');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const urlCredits = params.get('credits');
    
    // Set initial credits from URL or default based on user type
    if (urlCredits) {
      const parsedCredits = parseInt(urlCredits);
      setCredits(isGuest ? Math.min(parsedCredits, 25) : parsedCredits);
    } else {
      setCredits(isGuest ? 25 : 75);
    }
  }, [email, router, isGuest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: email,
          message: userMessage,
          model_select: model
        }),
      });

      if (response.status === 402) {
        alert(
          lang === 'id'
            ? 'Kredit Anda habis. Silakan login dengan Google untuk mendapatkan kredit tambahan.'
            : lang === 'en'
            ? 'Out of credits. Please login with Google to get additional credits.'
            : 'クレジットがなくなりました。Googleでログインして追加クレジットを取得してください。'
        );
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        // Update credits with guest limit
        const newCredits = parseInt(data.credits);
        setCredits(isGuest ? Math.min(newCredits, 25) : newCredits);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      alert(
        lang === 'id'
          ? 'Gagal mengirim pesan. Silakan coba lagi.'
          : lang === 'en'
          ? 'Failed to send message. Please try again.'
          : 'メッセージの送信に失敗しました。もう一度お試しください。'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={darkMode ? darkBg : animeBg}>
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl text-center">
          <p className="text-gray-800 mb-4">
            {lang === 'id'
              ? 'Belum login.'
              : lang === 'en'
              ? 'Not logged in.'
              : 'ログインしていません。'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {lang === 'id'
              ? 'Klik untuk login'
              : lang === 'en'
              ? 'Click to login'
              : 'ログインするにはクリック'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={darkMode ? darkBg : animeBg}>
      <div className="p-4 bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Chat with AI</h1>
          <div className="text-sm text-white">Credits: {credits}</div>
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
              <div className={`${msg.role === 'user' ? 'text-blue-800' : 'text-gray-800'} dark:text-white`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white/10 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder={loading ? 'AI sedang mengetik...' : 'Ketik pesan Anda...'}
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

export default ChatPage;
