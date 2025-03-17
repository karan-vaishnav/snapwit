import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [tweetUrl, setTweetUrl] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);
  const [isRegenerate, setIsRegenerate] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white dark:bg-black">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 dark:text-white dark:fill-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
              />
            </svg>
          </span>
          <h1 className="text-xl font-semibold text-black dark:text-white">
            SnapWit
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:cursor-pointer"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 dark:bg-black">
        <h2 className="text-lg italic mb-6 text-black dark:text-white">
          AI-Powered Comments
        </h2>
        <div className="w-full max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchSuggestions(isRegenerate);
            }}
            className="space-y-2"
          >
            <div className=" flex flex-col border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 justify-center">
              <div className="relative flex gap-2">
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
                  className="w-full h-10 pr-10 mb-2"
                />
                <button
                  type="submit"
                  disabled={loading || creditsLeft === 0}
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                    loading || creditsLeft === 0
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <span className="w-1 h-6 border-2 border-t-transparent border-white rounded-full animate-spin hover:cursor-pointer" />
                  ) : isRegenerate ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div>
                {creditsLeft !== null && (
                  <p className="text-sm text-gray-600 dark:text-white">
                    Credits Left: {creditsLeft ?? "N/A"}
                  </p>
                )}
              </div>
            </div>
          </form>

          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

          {suggestions.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold dark:text-white">
                Suggestions:
              </h3>
              <ul className="mt-2 space-y-4">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-md"
                  >
                    <span className="block mb-2">{suggestion}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(suggestion)}
                        className="px-2 py-1 text-sm text-white border rounded-md flex items-center hover:cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-6 text-black dark:text-white"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => shareComment(tweetUrl, suggestion)}
                        className="px-2 py-1 text-sm border text-white dark:fill-white rounded-md flex items-center hover:cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="25"
                          height="25"
                          viewBox="0 0 50 50"
                        >
                          <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z"></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            suggestions.length === 0 &&
            creditsLeft !== null && (
              <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
                No suggestions generated.
              </p>
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-white dark:bg-black text-center text-sm">
        <div className="flex justify-center space-x-4 mb-2">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 dark:text-white"
          >
            𝕏 Twitter
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 dark:text-white"
          >
            GitHub
          </a>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Developed by Karan</p>
      </footer>
    </div>
  );
};

export default App;
