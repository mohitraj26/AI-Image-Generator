import {
  Check,
  Copy,
  Download,
  Save,
  Share2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
};

type Image = {
  url: string;
  prompt: string;
};

const STORAGE_KEY = "ai-image-history";

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const openModal = (image: Image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleSave = (image: Image) => {
    console.log("Saving image:", image);
    alert("Image saved to your gallery!");
  };

  const handleShare = async (image: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AI Generated Image",
          text: `Check out this AI-generated image: ${image.prompt}`,
          url: image.url,
        });
      } else {
        await navigator.clipboard.writeText(image.url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed: HistoryItem[] = JSON.parse(data);
        setHistory(parsed.reverse());
      } catch (e) {
        console.error("Error parsing history from localStorage", e);
      }
    }
  }, []);

  return (
    <div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">🕘 Your Image History</h1>

        {history.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No history found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="rounded-lg overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 cursor-pointer"
                onClick={() => openModal(item)}
              >
                <img
                  src={item.url}
                  alt={item.prompt}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold">{item.prompt}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-7xl max-h-[95vh] w-full rounded-xl overflow-y-auto bg-white dark:bg-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold">AI Generated Image</h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[calc(95vh-80px)]">
              <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              </div>

              <div className="lg:w-80 p-6 border-l border-slate-200 dark:border-slate-700">
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Prompt:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedImage.prompt}
                  </p>
                </div>

                <div className="mb-6 space-y-2 text-sm">
                  <p className="text-sm font-medium mb-2">Details:</p>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Format:</span>
                    <span>JPEG</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Generated:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Style:</span>
                    <span>AI Generated</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleDownload(selectedImage.url)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleSave(selectedImage)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => handleShare(selectedImage)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-5 w-5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs mb-3 text-slate-500 dark:text-slate-400">
                    More Actions:
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300">
                      <Copy className="h-4 w-4 mx-auto" />
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300">
                      ♥
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
