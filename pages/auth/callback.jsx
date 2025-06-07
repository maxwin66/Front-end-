import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const { token, email } = router.query;
    console.log('Auth callback query:', { token, email });
    if (token && email) {
      sessionStorage.setItem('token', token as string);
      localStorage.setItem('user', JSON.stringify({ email, isGuest: false }));
      router.push(`/menu?email=${encodeURIComponent(email as string)}`);
    } else {
      console.error('No token or email in callback');
      window.alert(
        router.query.lang === "id"
          ? "Gagal login dengan Google. Silakan coba lagi."
          : router.query.lang === "en"
            ? "Failed to log in with Google. Please try again."
            : "Googleでのログインに失敗しました。もう一度お試しください。"
      );
      router.push('/');
    }
  }, [router.query]);

  return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
};

export default AuthCallback;
