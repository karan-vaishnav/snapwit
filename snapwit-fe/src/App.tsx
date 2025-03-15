import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [tweetUrl, setTweetUrl] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (regen: boolean = false) => {
    if (!tweetUrl.trim()) {
      setError("Please enter a valid Tweet URL.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const response = await axios.post(
        "http://localhost:5000/comments/suggest",
        {
          tweetUrl,
          regen,
        }
      );
      console.log("Backend response:", response.data);
      setSuggestions(response.data.aiComments || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">SnapWit</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchSuggestions();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
            placeholder="Enter Tweet URL"
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Generating..." : "Get Suggestions"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {suggestions.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Suggestions:</h2>
            <ul className="mt-2 space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="p-2 bg-gray-50 rounded-md">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
