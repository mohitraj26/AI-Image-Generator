import { useEffect, useState } from "react";

type HistoryItem = {
  id: string; // unique ID (timestamp or uuid)
  url: string;
  prompt: string;
  timestamp: string;
};

// LocalStorage Key
const STORAGE_KEY = "ai-image-history";

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed: HistoryItem[] = JSON.parse(data);
        setHistory(parsed.reverse()); // show latest first
      } catch (e) {
        console.error("Error parsing history from localStorage", e);
      }
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🕘 Your Image History</h1>

      {history.length === 0 ? (
        <p className="text-slate-500">No history found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {history.map((item) => (
            <div key={item.id} className="rounded-lg overflow-hidden shadow-md border">

              <img src={item.url} alt={item.prompt} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="font-semibold">{item.prompt}</p>
                <p className="text-sm text-slate-500">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
