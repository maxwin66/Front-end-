import { useState, useContext, useEffect } from "react";
import { UiContext } from "./_app";
import { useRouter } from "next/router";

// Define Props interface
interface Props {
  onBack: () => void;
  email: string;
  credits: number;
  onCreditsUpdate: (newCredits: number) => void;
}

const texts = {
  title: "Buat Gambar AI",
  placeholder: "Masukkan deskripsi gambar yang kamu inginkan...",
  generate: "Buat Gambar",
  generating: "Membuat...",
  download: "Unduh Gambar",
  back: "Kembali ke Chat",
  credits: "Kredit:",
  cost: "Biaya: 10 kredit per gambar",
  error: {
    noCredits: "Kredit tidak cukup! Diperlukan 10 kredit.",
    failed: "Gagal membuat gambar. Silakan coba lagi.",
  },
};

const animeBg = {
  background: "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png') center/cover no-repeat",
  minHeight: "100vh",
};

const darkBg = {
  background: "linear-gradient(135deg,#0f172a 40%,#172554 100%)",
  minHeight: "100vh",
};

const GenerateImagePage: React.FC<Props> = ({ onBack, email, credits: initialCredits, onCreditsUpdate }) => {
  const { darkMode } = useContext(UiContext);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(initialCredits);
  const router = useRouter();

  // Sync credits with props
  useEffect(() => {
    console.log("Syncing credits:", initialCredits);
    setCredits(initialCredits);
  }, [initialCredits]);

  // Validation
  const canGenerate = credits >= 10 && !loading && prompt.trim().length > 0;

  const handleGenerate = async () => {
    if (!canGenerate) {
      if (credits < 10) setError(texts.error.noCredits);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      console.log("Sending request to /api/generate-image with prompt:", prompt, "email:", email);
      const response = await fetch("https://backend-cb98.onrender.com/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email,
          prompt: prompt,
        }),
      });

      console.log("API response status:", response.status);
      const data = await response.json();

      if (response.ok) {
        setResult(data.image);
        const newCredits = parseInt(data.credits) || credits - 10; // Pastikan credits numeric
        onCreditsUpdate(newCredits);
      } else {
        throw new Error(data.error || data.message || texts.error.failed);
      }
    } catch (err: any) {
      console.error("API error:", err.message);
      setError(err.message || texts.error.failed);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;

    try {
      const byteCharacters = atob(result);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mykugy-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen" style={darkMode ? darkBg : animeBg}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {texts.title}
            </h1>
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {texts.back}
            </button>
          </div>

          {/* Credits Info */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {texts.credits} {credits}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {texts.cost}
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={texts.placeholder}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              rows={4}
            />

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full py-3 rounded-lg font-medium text-white transition
                ${!canGenerate
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"}`}
            >
              {loading ? texts.generating : texts.generate}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Result Area */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
                <img
                  src={`data:image/png;base64,${result}`}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={handleDownload}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {texts.download}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImagePage;
