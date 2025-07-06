import { useEffect, useState } from "react";

type CommunityImage = {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
};

const CommunityPage = () => {
  const [images, setImages] = useState<CommunityImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(images);

  useEffect(() => {
    // Simulate fetching random images from a "global" community
    setIsLoading(true);
    const mockData: CommunityImage[] = Array.from({ length: 20 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      url: `https://picsum.photos/seed/${i}/600/400`,
      prompt: `Random prompt #${i + 1}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
    }));


    // Shuffle the images randomly (for randomness feel)
    const shuffled = mockData.sort(() => 0.5 - Math.random());
    setImages(shuffled);
    setIsLoading(false);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🌍 Community Gallery</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((item) => (
            <div key={item.id} className="rounded-lg overflow-hidden shadow-md border">
              <img src={item.url} alt={item.prompt} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="font-semibold">{item.prompt}</p>
                <p className="text-sm text-slate-500">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
