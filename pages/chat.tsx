import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ChatInterface from '../components/ChatInterface';
import ThemeLangSwitcher from '../components/ThemeLangSwitcher';

const ChatPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    // Get email and guest status from URL params
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (!emailParam) {
      router.push('/');
      return;
    }

    const isGuestEmail = emailParam.toLowerCase().startsWith('guest');
    setEmail(emailParam);
    setIsGuest(isGuestEmail);
    setCredits(isGuestEmail ? 20 : 75);

    // Clean up URL
    window.history.replaceState({}, document.title, '/chat');
  }, [router]);

  if (!email) return null;

  return (
    <>
      <ThemeLangSwitcher />
      <ChatInterface
        email={email}
        isGuest={isGuest}
        credits={credits}
      />
    
