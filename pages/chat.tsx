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
  const [credits, setCredits] = useState<number>(0);
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
    
    if (urlCredits) {
      const parsedCredits = parseInt(urlCredits);
      setCredits(isGuest ? Math.min(parsedCredits, 25) : parsedCredits);
    } else {
      const storedCredits = localStorage.getItem('user_credits');
      if (storedCredits) {
        const parsedCredits = parseInt(storedCredits);
        setCredits(isGuest ? Math.min(parsedCredits, 25) : parsedCredits);
      } else {
        setCredits(isGuest ? 25 : 75);
      }
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
        const newCredits = parseInt(data.credits);
        setCredits(isGuest ? Math.min(newCredits, 25) : newCredits);
        localStorage.setItem('user_credits', String(isGuest ? Math.min(newCredits, 25) : newCredits));
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
          <button
            onClick={() => router.push('/')}
            className="text-blue-500 hover:text-blue-600 underline"
          >
            {lang === 'id'
              ? 'Klik untuk login'
              : lang === 'en'
              ? 'Click to login'
              : 'ログインするにはクリック'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={darkMode ? darkBg : animeBg}>
      <div className="p-4 bg-blue-500/90 backdrop-blur-sm dark:bg-blue-600/90 text-white">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Chat with AI</h1>
          <div className="text-sm">
            {lang === 'id'
              ? `Kredit: ${credits}`
              : lang === 'en'
              ? `Credits: ${credits}`
              : `クレジット: ${credits}`}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500/10 ml-auto mr-0 text-right'
                  : 'bg-white/10 mr-auto ml-0'
              }`}
            >
              <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {message.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === 'id'
                ? 'Ketik pesan...'
                : lang === 'en'
                ? 'Type a message...'
                : 'メッセージを入力...'
            }
            className="flex-1 px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading
              ? lang === 'id'
                ? 'Mengirim...'
                : lang === 'en'
                ? 'Sending...'
                : '送信中...'
              : lang === 'id'
              ? 'Kirim'
              : lang === 'en'
              ? 'Send'
              : '送信'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
