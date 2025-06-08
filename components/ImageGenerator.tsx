import { useState } from 'react';
import { useRouter } from 'next/router';

interface ImageGeneratorProps {
  email: string;
  initialCredits?: number;
  darkMode?: boolean;
}

const BACKEND_URL = "https://backend-cb98.onrender.com";

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ email, initialCredits = 0, darkMode }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState(initialCredits);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    if (credits < 10) {
      alert('Anda membutuhkan minimal 10 kredit untuk membuat gambar.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
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
        setCredits(parseInt(data.credits));
        setPrompt('');
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      setError('Gagal membuat gambar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Buat Gambar dengan AI
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Credits: {credits} (Biaya: 10 credits/gambar)
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Deskripsikan gambar yang ingin Anda buat..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
              disabled={loading}
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || credits < 10}
              className={`w-full py-3 rounded-lg font-medium text-white transition
                ${loading || !prompt.trim() || credits < 10
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90'
                }`}
            >
              {loading ? 'Membuat Gambar...' : 'Generate Gambar'}
            </button>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {generatedImage && (
              <div className="mt-6">
                <img
                  src={`data:image/png;base64,${generatedImage}`}
                  alt="Generated"
                  className="w-full rounded-lg shadow-lg"
                />
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `data:image/png;base64,${generatedImage}`;
                    link.download = 'generated-image.png';
                    link.click();
                  }}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Download Gambar
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
