import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ChatInterface from '../components/ChatInterface';
import ThemeLangSwitcher from '../components/ThemeLangSwitcher';

const ChatPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const guestParam = params.get('guest');
    console.log('ChatPage query:', { emailParam, guestParam });

    if (!emailParam) {
      console.log('No email param, redirecting to /');
      router.push('/');
      return;
    }

    setEmail(emailParam);
    const isGuestEmail = emailParam.toLowerCase().startsWith('guest');
    setIsGuest(isGuestEmail);
    setCredits(isGuestEmail ? 20 : 75);
    setIsLoading(false);

    // Clean up URL
    window.history.replaceState({}, document.title, '/chat');
  }, [router.query]);

  if (isLoading || !email) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <>
      <ThemeLangSwitcher />
      <ChatInterface
        email={email}
        isGuest={isGuest}
        credits={credits}
      />
    </>
  );
};

export default ChatPage;
