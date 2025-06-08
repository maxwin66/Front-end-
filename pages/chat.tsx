import { useState, useContext, useEffect } from 'react';
import { UiContext } from './_app';
import { useRouter } from 'next/router';
import useGoogleLoginEffect from '../hooks/useGoogleLoginEffect';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { darkMode, lang } = useContext(UiContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number>(75);
  const [model, setModel] = useState('OpenRouter (Grok 3 Mini Beta)');

  useGoogleLoginEffect();

  const email = typeof window !== 'undefined' ? localStorage.getItem('user_email') : '';
  const isGuest = email?.includes('@guest.kugy.ai') || false;

  useEffect(() => {
    if (!email) {
      router.push('/');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('https://backend-cb98.onrender.com/api/chat', {
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
        setCredits(parseInt(data.credits));
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Credits: {credits}
            </p>
          </div>

          <div className="space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-100 dark:bg-blue-900 ml-auto'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder={loading ? 'Waiting for response...' : 'Type your message...'}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
