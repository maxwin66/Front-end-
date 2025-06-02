import Head from "next/head";
import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  // State untuk email user
  const [email, setEmail] = useState<string | null>("");

  // Cek email di query param setelah redirect Google OAuth, simpan ke localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      localStorage.setItem("user_email", emailParam);
      setEmail(emailParam);
      // Bersihkan query param dari URL supaya rapi
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const stored = localStorage.getItem("user_email");
      setEmail(stored);
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <>
      <Head>
        <title>MyKugy - Asisten Imut Kamu</title>
        <meta name="description" content="MyKugy, asisten AI imut dengan nuansa anime biru." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Sora:wght@600&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen flex flex-col bg-anime bg-cover bg-center bg-no-repeat">
        <header className="flex items-center justify-between px-6 py-5 bg-transparent">
          <div className="text-2xl font-bold text-sky-500 tracking-wider font-sora drop-shadow">
            MyKugy
          </div>
          <nav className="space-x-8 hidden sm:block">
            <a href="#home" className="text-base text-gray-700 dark:text-gray-100 hover:text-sky-600 font-semibold transition">Home</a>
            <a href="#about" className="text-base text-gray-700 dark:text-gray-100 hover:text-sky-600 font-semibold transition">About</a>
            <a href="#contact" className="text-base text-gray-700 dark:text-gray-100 hover:text-sky-600 font-semibold transition">Contact</a>
          </nav>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <section className="glass max-w-xl w-full mx-auto p-8 text-center mt-10 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-500 text-transparent bg-clip-text mb-4 font-sora drop-shadow">
              Selamat Datang di MyKugy! 🐾
            </h1>
            <p className="mb-2 text-lg text-gray-700 dark:text-gray-200">
              Asisten virtual imut dengan sentuhan biru dan nuansa anime.
            </p>
            <p className="mb-6 text-base text-sky-800 dark:text-sky-200">
              Mulai dengan mode tamu, atau daftar untuk fitur lebih banyak!
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              {!email ? (
                <>
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-800 shadow-md font-semibold border border-sky-300 hover:bg-sky-50 transition group"
                  >
                    <svg width="22" height="22" viewBox="0 0 48 48" className="inline-block">
                      <g>
                        <path fill="#4285F4" d="M43.6 20.5H42V20.4H24V27.6H35.2C33.6 32.2 29.2 35.4 24 35.4c-6.1 0-11.1-5-11.1-11.1s5-11.1 11.1-11.1c2.6 0 5 .9 6.9 2.6l5.2-5.2C33.3 7.3 28.9 5.4 24 5.4c-9.5 0-17.1 7.7-17.1 17.1S14.5 39.6 24 39.6c8.6 0 16.1-6.2 16.1-16.1 0-1-.1-2.1-.3-3z"/>
                        <path fill="#34A853" d="M6.3 14.7l5.7 4.2C13.4 16.2 18.3 12.9 24 12.9c2.6 0 5 .9 6.9 2.6l5.2-5.2C33.3 7.3 28.9 5.4 24 5.4c-6.6 0-12.3 3.8-15.1 9.3z"/>
                        <path fill="#FBBC05" d="M24 44c5.2 0 9.6-1.7 12.8-4.7l-6-4.9c-1.7 1.3-4.1 2-6.8 2-5.2 0-9.6-3.5-11.1-8.3l-6.1 4.7C7.9 40.1 15.3 44 24 44z"/>
                        <path fill="#EA4335" d="M43.6 20.5H42V20.4H24V27.6H35.2C34.6 29.1 33.6 30.2 32.4 31.1l6 4.7c3.5-3.2 5.6-7.8 5.6-13.3 0-1-.1-2.1-.3-3z"/>
                      </g>
                    </svg>
                    Daftar dengan Gmail
                  </button>
                  <a href={BACKEND_URL || "#"} target="_blank" rel="noopener">
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-bold shadow-md hover:scale-105 transform transition">
                      Mulai sebagai Tamu
                    </button>
                  </a>
                </>
              ) : (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="text-base text-sky-700 dark:text-sky-200">
                    Login sebagai <b>{email}</b>
                  </div>
                  <a href="/chat">
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-bold shadow-md hover:scale-105 transform transition">
                      Masuk ke Chat AI
                    </button>
                  </a>
                  <button
                    onClick={() => {
                      localStorage.removeItem("user_email");
                      setEmail("");
                    }}
                    className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold border border-red-200 hover:bg-red-200 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <div className="feature-preview mt-4">
              <h3 className="text-lg font-bold text-indigo-600 mb-3">Fitur Menarik:</h3>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button className="px-5 py-2 rounded-lg glass text-gray-700 bg-white/80 border border-gray-200 shadow-sm cursor-not-allowed opacity-70" disabled>
                  Coba Face Swap
                </button>
                <button className="px-5 py-2 rounded-lg glass text-gray-700 bg-white/80 border border-gray-200 shadow-sm cursor-not-allowed opacity-70" disabled>
                  Buat Gambar
                </button>
              </div>
              <p className="note mt-2 text-sm text-gray-600">
                Aktifkan fitur ini setelah masuk mode tamu atau daftar!
              </p>
            </div>
          </section>
          <section className="glass max-w-2xl w-full mx-auto mt-10 p-7 text-center">
            <h2 className="text-2xl font-bold text-sky-600 mb-2">Tentang MyKugy</h2>
            <p className="text-gray-700 dark:text-gray-200">
              MyKugy adalah asisten AI dengan gaya santai, imut, dan nuansa anime. Dengan warna biru dominan & desain modern, kami bawa pengalaman baru buat kamu!
            </p>
          </section>
        </main>
        <footer className="py-6 text-center text-gray-500 font-medium text-sm bg-transparent">
          © 2025 MyKugy. All rights reserved.
        </footer>
      </div>
    </>
  );
}