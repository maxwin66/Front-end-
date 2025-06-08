import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UiContext } from '../_app';

const AuthCallback: React.FC = () => {
  const router = useRouter();
  const { lang } = useContext(UiContext);

  useEffect(() => {
    if (!router.isReady) return;

    const { token, email } = router.query;

    console.log('Auth callback query:', { token, email });

    if (typeof token === 'string' && typeof email === 'string') {
      sessionStorage.setItem('token', token);
      localStorage.setItem('user_email', email);
      router.push(`/menu?email=${encodeURIComponent(email)}`);
    } else {
      console.error('Invalid token or email in callback:', { token, email });
      window.alert(
        lang === 'id'
          ? 'Gagal login dengan Google. Silakan coba lagi.'
          : lang === 'en'
          ? 'Failed to log in with Google. Please try again.'
          : 'Googleでのログインに失敗しました。もう一度お試しください。'
      );
      router.push('/');
    }
  }, [router.isReady, router.query, lang, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
};

export default AuthCallback;
