import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { ImageIcon, LogOut, Sparkles, Github, Twitter, Heart, X, Download, Save, Share2, Copy, Check, Settings, User, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type GeneratedImage = {
  url: string;
  prompt: string;
};

type Image = {
  url: string;
  prompt: string;
};

import { ModeToggle } from "@/components/mode-toggle"; // Assuming ModeToggle handles theme context/global class

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

async function query(prompt: string): Promise<string> {
  const response = await fetch(
    "https://router.huggingface.co/nebius/v1/images/generations",
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        prompt: prompt,
        model: "black-forest-labs/flux-dev",
        response_format: "b64_json"
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();

  if (!json || !json.data || !json.data[0] || !json.data[0].b64_json) {
    throw new Error("No base64 image found in the response");
  }

  const base64Image = json.data[0].b64_json;
  return `data:image/png;base64,${base64Image}`;
}

const Dashboard = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();


  const openModal = (image : Image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
  if (isModalOpen) {
    document.body.style.overflow = 'hidden'; // Disable background scroll
  } else {
    document.body.style.overflow = 'auto'; // Re-enable scroll
  }

  return () => {
    document.body.style.overflow = 'auto'; // Cleanup in case component unmounts
  };
}, [isModalOpen]);

  const handleDownload = async (imageUrl : string, prompt : string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleSave = (image : Image) => {
    // Mock save functionality - in real app, this would save to user's gallery/favorites
    console.log('Saving image:', image);
    alert('Image saved to your gallery!');
  };

  const handleShare = async (image : any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AI Generated Image',
          text: `Check out this AI-generated image: ${image.prompt}`,
          url: image.url
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(image.url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const STORAGE_KEY = "ai-image-history";
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const imageUrl = await query(prompt);
      console.log("Generated image URL:", imageUrl);

      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt,
      };

      // 1. Update UI state
      setImages([newImage, ...images]);
      setPrompt("");

      // 2. Save to localStorage
      const existing = localStorage.getItem(STORAGE_KEY);
      const history = existing ? JSON.parse(existing) : [];

      const newHistoryItem = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify([...history, newHistoryItem]));

    } catch (error) {
      console.error("Error generating image:", error);
      alert("Image generation failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/dashboard");
  };

  return (
    // The outermost div will now rely on global Tailwind dark mode classes,
    // which ModeToggle should manage (e.g., 'dark' class on <html>).
    // Ensure your tailwind.config.js is set up for dark mode with 'class' strategy.
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      {/* Navbar */}
      <nav className="border-b transition-colors duration-300 border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Title */}
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Sparkles className="h-6 w-6 text-blue-500" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                AI Image Generator
              </h1>
            </div>

            {/* Right: Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-5">
              <button
                onClick={() => navigate('/community')}
                className="cursor-pointer p-2 rounded-md transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >Community</button>
              <button
                onClick={() => navigate('/history')}
                className="cursor-pointer p-2 rounded-md transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >History</button>

              <ModeToggle /> {/* Render ModeToggle component here */}

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button onClick={handleLogout} className="flex gap-2 items-center w-full text-left">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile: Hamburger Menu */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <button
                onClick={() => { navigate('/community'); setMenuOpen(false); }}
                className="block w-full text-left p-2 rounded-md transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >Community</button>
              <button
                onClick={() => { navigate('/history'); setMenuOpen(false); }}
                className="block w-full text-left p-2 rounded-md transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >History</button>
              {/* If ModeToggle can be used programmatically or provides a direct toggle, integrate it here */}
              {/* For simplicity, if ModeToggle handles a global dark class, you might not need a separate mobile toggle within this menu */}
              <div className="block w-full text-left p-2 rounded-md transition-colors">
                <ModeToggle />
              </div>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="block w-full text-left p-2 rounded-md transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Create Stunning Images with{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              AI Magic
            </span>
          </h2>
          <p className="text-lg mb-8 text-slate-600 dark:text-slate-400">
            Transform your ideas into beautiful visuals with our advanced AI image generation
          </p>
          
          {/* Input Section */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Describe your image... (e.g., A peaceful lake at sunset)"
                  className="w-full px-4 py-3 rounded-lg border transition-colors bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  isLoading || !prompt.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  'Generate Image'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="mb-12">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="group rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer bg-white border border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600 shadow-lg hover:shadow-xl"
                  onClick={() => openModal(img)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                        <ImageIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm line-clamp-2 text-slate-600 dark:text-slate-300">
                      {img.prompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-slate-100 dark:bg-slate-800">
                <ImageIcon className="h-12 w-12 text-slate-500 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-300">
                No images generated yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Enter a prompt above to create your first AI-generated image
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-7xl max-h-[95vh] w-full rounded-xl overflow-y-auto bg-white dark:bg-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold">AI Generated Image</h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg transition-colors hover:bg-slate-100 text-slate-600 hover:text-slate-700 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col lg:flex-row max-h-[calc(95vh-80px)]">
              {/* Image Section */}
              <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              </div>
              
              {/* Info and Actions Section */}
              <div className="lg:w-80 p-6 border-l border-slate-200 dark:border-slate-700">
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Prompt:
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {selectedImage.prompt}
                  </p>
                </div>

                {/* Image Details */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Details:
                  </p>
                  <div className="space-y-2 text-sm">
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
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleDownload(selectedImage.url, selectedImage.prompt)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Image</span>
                  </button>
                  
                  <button
                    onClick={() => handleSave(selectedImage)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save to Gallery</span>
                  </button>
                  
                  <button
                    onClick={() => handleShare(selectedImage)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-5 w-5" />
                        <span>Share Image</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Additional Actions */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs mb-3 text-slate-500 dark:text-slate-400">
                    More Actions:
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-3 py-2 text-sm rounded-lg transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                    >
                      <Copy className="h-4 w-4 mx-auto" />
                    </button>
                    <button
                      className="flex-1 px-3 py-2 text-sm rounded-lg transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                    >
                      ♥
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t transition-colors duration-300 border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">AI Image Generator</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Create beautiful images with the power of artificial intelligence. 
                Transform your imagination into stunning visuals.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="transition-colors text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                    Gallery
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                    API
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">
                Connect
              </h4>
              <div className="flex space-x-4">
                <a href="#" className="p-2 rounded-lg transition-colors bg-slate-100 text-slate-600 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 rounded-lg transition-colors bg-slate-100 text-slate-600 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 AI Image Generator. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm mt-2 sm:mt-0 text-slate-600 dark:text-slate-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>by Mohit</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;