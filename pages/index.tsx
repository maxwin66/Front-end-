import Head from "next/head";

export default function Home() {
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
              <a href="https://backend-cb98.onrender.com/auth/google" target="_blank" rel="noopener">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-800 shadow-md font-semibold border border-sky-300 hover:bg-sky-50 transition group">
                  <svg width="22" height="22" viewBox="0 0 48 48" className="inline-block">
                    <g><path fill="#4285F4" d="M43.6 20.5H42V20.4H24V27.6H35.2C33.6 32.2 29.2 35.4 24 35.4c-6.1 0-11.1-5-11.1-11.1s5-11.1 11.1-11.1c2.6 0 5 .9 6.9 2.6l5.2-5.2C33.3 7.3 28.9 5.4 24 5.4c-10.3 0-18.6 8.3-18.6 18.6s8.3 18.6 18.6 18.6c9.3 0 17.2-6.7 18.5-15.4.1-.5.1-1 .1-1.5 0-1.2-.1-2.3-.2-3.2z"/><path fill="#34A853" d="M6.3 14.7l5.7 4.2c1.5-2.8 3.9-5 6.7-6.5L12 8.9C9.1 11.4 6.7 14.7 6.3 14.7z"/><path fill="#FBBC05" d="M24 8.7c2.6 0 5 .9 6.9 2.6l5.2-5.2C33.3 7.3 28.9 5.4 24 5.4c-5.6 0-10.5 2.3-14.1 6l5.7 4.4C18.9 10.6 21.3 8.7 24 8.7z"/><path fill="#EA4335" d="M24 43.2c4.9 0 9.3-1.7 12.8-4.6l-5.9-4.8c-2 1.4-4.6 2.2-7.4 2.2-5.2 0-9.6-3.2-11.2-7.7l-5.6 4.3c3.6 7 11.1 11.6 19.1 11.6z"/><path fill="none" d="M0 0h48v48H0z"/></g>
                  </svg>
                  Daftar dengan Gmail
                </button>
              </a>
              <a href="https://backend-cb98.onrender.com" target="_blank" rel="noopener">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-bold shadow-md hover:scale-105 transform transition">
                  Mulai sebagai Tamu
                </button>
              </a>
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
