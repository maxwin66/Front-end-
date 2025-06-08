import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ImageGenerator from '../components/ImageGenerator';

const GenerateImagePage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem('user_email');
    const token = sessionStorage.getItem('token');

    if (!storedEmail || !token) {
      router.push('/');
      return;
    }

    setEmail(storedEmail);
    setCredits(Number(router.query.credits) || 0);
  }, [router]);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <ImageGenerator email={email} initialCredits={credits} />;
};

export default GenerateImagePage;
