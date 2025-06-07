import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UiContext } from '../_app';

const AuthCallback = () => {
  const router = useRouter();
  const { lang } = useContext(UiContext);

  useEffect(() => {
    // Tunggu sampai router.query terisi
    if (!router.isReady) return;

    const { token, email } = router.query;
    console.log('Auth callback query:', { token, email });

    if (token && email) {
      sessionStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email, isGuest: false }));
      router.push(`/menu?email=${encodeURIComponent(email)}`);
    } else {
      console.error('No token or email in callback');
      window.alert(
        lang === "id"
          ? "Gagal login dengan Google. Silakan coba lagi."
          : lang === "en"
            ? "Failed to log in with Google. Please try again."
            : "Googleでのログインに失敗しました。もう一度お試しください。"
      );
      router.push('/');
    }
  }, [router.isReady, router.query, lang]);

  return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
};

export default AuthCallback;
