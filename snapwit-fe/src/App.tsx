import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [tweetUrl, setTweetUrl] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);
  const [isRegenerate, setIsRegenerate] = useState(false);

  const fetchSuggestions = async (regen: boolean = false) => {
    if (!tweetUrl.trim()) {
      setError("Please enter a valid Tweet URL.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://snapwit-production.up.railway.app/comments/suggest",
        { tweetUrl, regen }
      );
      const nestedData = response.data.aiComments;
      const aiComments = nestedData.aiComments;
      const remainingCredits = nestedData.creditsLeft;
      setSuggestions(Array.isArray(aiComments) ? aiComments : []);
      setCreditsLeft(remainingCredits !== undefined ? remainingCredits : null);
      setIsRegenerate(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("Copied to clipboard!");
      },
      () => {
        setError("Failed to copy text.");
      }
    );
  };

  const getTweetIdFromUrl = (url: string) => {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
  };

  const shareComment = (tweetUrl: string, comment: string) => {
    const tweetId = getTweetIdFromUrl(tweetUrl);
    if (!tweetId) {
      setError("Invalid Tweet URL. Please ensure it’s a valid tweet link.");
      return;
    }
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      comment
    )}&in_reply_to=${tweetId}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">SnapWit</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchSuggestions(isRegenerate);
          }}
          className="space-y-4"
        >
          <input
            type="text"
            value={tweetUrl}
            onChange={(e) => {
              setTweetUrl(e.target.value);
              setIsRegenerate(false);
              setCreditsLeft(null);
              setSuggestions([]);
            }}
            placeholder="Enter Tweet URL"
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />

          <button
            type="submit"
            disabled={loading || creditsLeft === 0}
            className={`w-full p-2 rounded-md text-white font-semibold ${
              loading || creditsLeft === 0
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading
              ? "Generating..."
              : creditsLeft === 0
              ? "No Credits Left"
              : isRegenerate
              ? "Regenerate"
              : "Get Suggestions"}
          </button>
        </form>

        {creditsLeft !== null && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            Credits Left: {creditsLeft ?? "N/A"}
          </p>
        )}

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {suggestions.length > 0 ? (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Suggestions:</h2>
            <ul className="mt-2 space-y-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span className="flex-1">{suggestion}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(suggestion)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => shareComment(tweetUrl, suggestion)}
                      className="px-2 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded-md"
                    >
                      Share
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          suggestions.length === 0 &&
          creditsLeft !== null && (
            <p className="mt-4 text-gray-500 text-center">
              No suggestions generated.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default App;
