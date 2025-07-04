import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

type GeneratedImage = {
  url: string;
  prompt: string;
};

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;


async function query(data: any): Promise<string> {
  const response = await fetch(
    "https://router.huggingface.co/together/v1/images/generations",
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  console.log("API response:", json);


  // The image is usually in json.generated_image or similar depending on the model response format
  const base64 = json.image || json.generated_image || json[0]?.image_base64;

  if (!base64) {
    throw new Error("No base64 image found in the response");
  }

  return `data:image/png;base64,${base64}`;
}



const Dashboard = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const imageUrl = await query({
        prompt,
        response_format: "base64", // required
        model: "black-forest-labs/FLUX.1-dev",
      });

      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt,
      };

      setImages([newImage, ...images]);
      setPrompt("");
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Image generation failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Image Generator</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded">
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter your prompt"
          className="flex-1 p-2 text-black rounded"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="bg-gray-800 p-2 rounded">
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-64 object-cover rounded"
              />
              <p className="mt-2 text-sm text-gray-300">Prompt: {img.prompt}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No images generated yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
