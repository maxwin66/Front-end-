import { useState } from 'react';
import { useRouter } from 'next/router';

interface Props {
  email: string;
  initialCredits: number;
}

const BACKEND_URL = "https://backend-cb98.onrender.com";

const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat fixed",
  minHeight: "100vh",
};

const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh",
};

const ImageGenerator: React.FC<Props> = ({ email, initialCredits }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState(initialCredits);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const isGuest = email?.includes('@guest.kugy.ai') || false;

  const handleGenerate = async () => {
    if (!prompt.trim() || loading || credits < 10) return;

    setLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
      // Untuk development, gunakan mock image
      if (process.env.NODE_ENV === 'development') {
        // Simulasi delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Mock generated images (placeholder images)
        const mockImages = [
          'https://picsum.photos/512/512?random=1',
          'https://picsum.photos/512/512?random=2',
          'https://picsum.photos/512/512?random=3',
          'https://picsum.photos/512/512?random=4',
          'https://picsum.photos/512/512?random=5',
        ];
        
        const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
        setGeneratedImage(randomImage);
        
        // Kurangi kredit
        const newCredits = Math.max(0, credits - 10);
        setCredits(newCredits);
        localStorage.setItem('user_credits', String(newCredits));
        setPrompt('');
        
      } else {
        // Untuk production, gunakan backend
        const response = await fetch(`${BACKEND_URL}/api/generate-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_email: email,
            prompt: prompt.trim()
          }),
        });

        if (response.status === 402) {
          alert('Kredit tidak cukup! Minimal butuh 10 kredit untuk generate gambar.');
          return;
        }

        const data = await response.json();

        if (response.ok && data.image) {
          setGeneratedImage(data.image);
          const newCredits = parseInt(data.credits);
          setCredits(isGuest ? Math.min(newCredits, 25) : newCredits);
          setPrompt('');
        } else {
          throw new Error(data.error || 'Failed to generate image');
        }
      }
    } catch (error) {
      console.error('Image generation error:', error);
      
      // Fallback untuk development jika ada error
      if (process.env.NODE_ENV === 'development') {
        setGeneratedImage('https://picsum.photos/512/512?random=fallback');
        const newCredits = Math.max(0, credits - 10);
        setCredits(newCredits);
        localStorage.setItem('user_credits', String(newCredits));
        setPrompt('');
      } else {
        setError('Gagal membuat gambar. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8" style={darkMode ? darkBg : animeBg}>
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">AI Image Generator</h1>
            <span className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-white hover:text-blue-200 transition"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            <div className="text-sm text-white bg-blue-500/80 px-3 py-1 rounded-full">
              Credits: {credits}
            </div>
            <button
              onClick={() => router.push('/menu')}
              className="text-white hover:text-blue-200 transition"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/30">
          <div className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Deskripsi Gambar (Biaya: 10 credits/gambar)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: A beautiful anime girl with long blue hair and blue eyes, wearing a white dress in a garden setting, masterpiece quality..."
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                disabled={loading}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || credits < 10}
              className={`w-full py-4 rounded-lg font-medium text-white transition-all
                ${loading || !prompt.trim() || credits < 10
                  ? 'bg-gray-500/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                } flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  <span>Membuat Gambar...</span>
                </>
              ) : (
                'Generate Gambar'
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-300/30 text-white rounded-lg">
                {error}
              </div>
            )}

            {generatedImage && (
              <div className="mt-6 space-y-4">
                <div className="relative aspect

-square w-full rounded-lg overflow-hidden border border-white/30">
                  <img
                    src={`data:image/png;base64,${generatedImage}`}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `data:image/png;base64,${generatedImage}`;
                    link.download = 'mykugy-ai-generated.png';
                    link.click();
                  }}
                  className="w-full py-3 bg-green-500/80 hover:bg-green-500/90 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Gambar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
