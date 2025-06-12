import { useState, useContext, useEffect } from 'react';
import { UiContext } from './_app';
import { useRouter } from 'next/router';
import useGoogleLoginEffect from '../hooks/useGoogleLoginEffect';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string;
}

const BACKEND_URL = "https://backend-cb98.onrender.com";

// Modern glassmorphism backgrounds
const animeBg = {
  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%), url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat fixed",
  minHeight: "100vh",
};

const darkBg = {
  background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.95) 100%)",
  minHeight: "100vh",
  backdropFilter: "blur(20px)",
};

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { darkMode, lang } = useContext(UiContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number>(0);
  const [model, setModel] = useState('OpenRouter (Grok 3 Mini Beta)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      id: Date.now().toString()
    };

    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: email,
          message: userMessage.content,
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
        const aiMessage: Message = {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
          id: (Date.now() + 1).toString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
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

  const handleNewChat = () => {
    setMessages([]);
    setSidebarOpen(false);
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={darkMode ? darkBg : animeBg}>
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/50 p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            {lang === 'id' ? 'Belum Login' : lang === 'en' ? 'Not Logged In' : 'ログインしていません'}
          </h3>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            {lang === 'id' 
              ? 'Silakan login untuk menggunakan AI Chat'
              : lang === 'en'
              ? 'Please login to use AI Chat'
              : 'AI Chatを使用するにはログインしてください'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          >
            {lang === 'id' ? 'Klik untuk Login' : lang === 'en' ? 'Click to Login' : 'ログインするにはクリック'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={darkMode ? darkBg : animeBg}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Glassmorphism Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-r border-white/20 dark:border-slate-700/50 flex flex-col transition-all duration-300 z-50 md:relative md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Chat</h1>
                <p className="text-sm text-gray-500 dark:text-slate-400">Modern Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Enhanced Credit Display */}
          <div className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">
                {lang === 'id' ? 'Kredit Tersisa' : lang === 'en' ? 'Credits Remaining' : 'クレジット残高'}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-300">
                <circle cx="8" cy="8" r="6"></circle>
                <path d="M18.09 10.37A6 6 0 1 1 10.37 18.09"></path>
                <path d="M7 6h1v4"></path>
                <path d="M9.75 9.75L11 11"></path>
              </svg>
            </div>
            <div className="text-2xl font-bold mb-2">{credits}</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500" 
                style={{ width: `${Math.min((credits / (isGuest ? 25 : 75)) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs mt-2 opacity-75">
              {Math.round(Math.min((credits / (isGuest ? 25 : 75)) * 100, 100))}% {
                lang === 'id' ? 'dari kuota bulanan' : lang === 'en' ? 'of monthly allocation' : '月間割り当ての'
              }
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-white/20 dark:border-slate-700/50">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-start px-4 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {lang === 'id' ? 'Chat Baru' : lang === 'en' ? 'New Chat' : '新しいチャット'}
          </button>
        </div>

        {/* Chat History Placeholder */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 mb-3 uppercase tracking-wide">
            {lang === 'id' ? 'Riwayat Chat' : lang === 'en' ? 'Recent Chats' : '最近のチャット'}
          </h3>
          <div className="text-center py-8 text-gray-500 dark:text-slate-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-2 opacity-50">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="text-sm">
              {lang === 'id' ? 'Belum ada sesi chat' : lang === 'en' ? 'No chat sessions yet' : 'チャットセッションがありません'}
            </p>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/20 dark:border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                {isGuest ? (lang === 'id' ? 'Pengguna Tamu' : lang === 'en' ? 'Guest User' : 'ゲストユーザー') : 'Pro Member'}
              </div>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                {email?.split('@')[0] || 'user'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Chat Header */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-b border-white/20 dark:border-slate-700/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                  <circle cx="12" cy="5" r="2"></circle>
                  <path d="M12 7v4"></path>
                  <line x1="8" y1="16" x2="8" y2="16"></line>
                  <line x1="16" y1="16" x2="16" y2="16"></line>
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {lang === 'id' ? 'Asisten AI' : lang === 'en' ? 'AI Assistant' : 'AIアシスタント'}
                </h2>
                <div className="text-sm text-green-500 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{lang === 'id' ? 'Online' : lang === 'en' ? 'Online' : 'オンライン'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area with Glassmorphism */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex justify-center">
              <div className="backdrop-blur-lg bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-8 text-center max-w-md shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {lang === 'id' ? 'Selamat Datang di AI Chat!' : lang === 'en' ? 'Welcome to AI Chat!' : 'AI Chatへようこそ！'}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'id' 
                    ? 'Tanyakan apa saja dan saya akan membantu Anda dengan jawaban yang detail dan thoughtful.'
                    : lang === 'en'
                    ? 'Ask me anything and I\'ll help you with detailed, thoughtful responses.'
                    : '何でも聞いてください。詳細で思慮深い回答でお手伝いします。'}
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  message.role === 'user'
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm"
                    : "backdrop-blur-lg bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-tl-sm"
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                        <circle cx="12" cy="5" r="2"></circle>
                        <path d="M12 7v4"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-end mt-2">
                        <span className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {message.role === 'user' && (
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-end mt-2 space-x-2">
                      <span className="text-xs opacity-75">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <div className="flex items-center space-x-1 opacity-75">
                        <div className="w-3 h-3 rounded-full border border-current"></div>
                        <div className="w-3 h-3 rounded-full bg-current"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="backdrop-blur-lg bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                      <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                    </svg>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Chat Input */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-t border-white/20 dark:border-slate-700/50 p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <div className="bg-gray-100/50 dark:bg-slate-700/50 rounded-2xl border border-gray-200/50 dark:border-slate-600/50 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-all duration-200 shadow-sm">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder={
                      lang === 'id'
                        ? 'Ketik pesan Anda...'
                        : lang === 'en'
                        ? 'Type your message...'
                        : 'メッセージを入力...'
                    }
                    className="w-full bg-transparent px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 resize-none focus:outline-none border-none min-h-[44px] max-h-32"
                    rows={1}
                    disabled={loading}
                  />
                  
                  <div className="flex items-center justify-end px-4 pb-3">
                    <div className="text-xs text-gray-400 dark:text-slate-500">
                      {input.length}/2000
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={handleNewChat}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default ChatPage;