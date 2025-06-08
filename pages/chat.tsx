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
      {/* Header */}
      <div className="p-4 bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">AI Anime Chat</h1>
            <span className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white bg-blue-500/80 px-3 py-1 rounded-full">
              Credits: {credits}
            </div>
            <button
              onClick={() => router.push('/menu')}
              className="text-white hover:text-blue-200 transition"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-white/80 py-8">
              <p className="text-lg mb-2">👋 Selamat datang di AI Anime Chat!</p>
              <p className="text-sm">Mulai ngobrol dengan mengirim pesan...</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg backdrop-blur-md ${
                  msg.role === 'user'
                    ? 'bg-blue-500/20 ml-auto max-w-[80%] border border-blue-300/30'
                    : 'bg-white/20 max-w-[80%] border border-white/30'
                } shadow-lg`}
              >
                <div className={`text-white`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white/10 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={loading ? 'AI sedang mengetik...' : 'Ketik pesan Anda...'}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <span>Kirim</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
