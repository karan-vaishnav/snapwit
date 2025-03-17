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

  // const copyToClipboard = (text: string) => {
  //   navigator.clipboard.writeText(text).then(
  //     () => {
  //       alert("Copied to clipboard!");
  //     },
  //     () => {
  //       setError("Failed to copy text.");
  //     }
  //   );
  // };

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
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-radial-[at_50%_0%] from-blue-300 from-0% via-slate-900 via-15% to-gray-950 to-100% sm:via-30% md:via-40% lg:via-30% dark"
          : "bg-radial-[at_50%_0%] from-blue-300 from-0% via-blue-300 via-15% to-sky-100 to-100% sm:via-30% md:via-40% lg:via-50%"
      }`}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 xl:size-8 text-sky-500 fill-sky-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
              />
            </svg>
          </span>
          <h1 className="xl:text-2xl text-xl font-semibold text-black dark:text-white">
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
              className="size-6 xl:size-8 text-white"
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
              className="size-6 xl:size-8"
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
      <main className="flex-grow flex flex-col items-center justify-center p-4 ">
        <h2 className="text-4xl italic mb-6 text-black dark:text-white">
        Stuck on what to say? 
        </h2>
        <p className="text-xl mb-40 text-gray-800 dark:text-gray-400 text-center">
        Drop a Twitter post URL into SnapWit and unlock AI-powered comments that slay!
<br/>
Only 3 credits per post to keep it fresh
        </p>
        <div className="w-full max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchSuggestions(isRegenerate);
            }}
            className="space-y-2"
          >
            <div
              className="flex flex-col border rounded-md p-2 justify-center text-white
    border-transparent
    [background:padding-box_linear-gradient(to_bottom,#374b6b,#374b6b),border-box_radial-gradient(circle_at_50%_100%,#ffffff_0%,rgba(255,255,255,0.3)_33.33%,rgba(255,255,255,0.14)_66.67%,rgba(255,255,255,0.1)_100%)]"
            >
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
                  className="w-full h-10 pr-10 focus:ring-0 focus:outline-none"
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
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-purple-500"></span>
                    </span>
                  ) : isRegenerate ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-6 text-purple-400"
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
                      className="size-6 text-purple-400"
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
                  <p className="text-sm text-center text-gray-200 bg-purple-500 p-1 rounded w-25 dark:text-white mt-2">
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
                    className="p-2 bg-blue-400 rounded-md flex justify-center items-center"
                  >
                    <span className="block mb-2">{suggestion}</span>
                    <div className="flex">
                      <button
                        onClick={() => shareComment(tweetUrl, suggestion)}
                        className="text-sm text-white fill-black flex items-center hover:cursor-pointer"
                      >
                        <svg
                          width="24px"
                          height="24px"
                          stroke-width="1.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          color="#f6f6f6"
                        >
                          <path
                            d="M20 13V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V13"
                            stroke="#f6f6f6"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M12 15V3M12 3L8.5 6.5M12 3L15.5 6.5"
                            stroke="#f6f6f6"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
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
      <footer className="p-4 text-center text-sm">
        <div className="flex justify-center space-x-4 mb-2">
          <a
            href="https://x.com/krn_vaishnav"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base hover:text-blue-500 dark:text-white"
          >
            Twitter
          </a>
          <a
            href="https://github.com/karan-vaishnav"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base hover:text-blue-500 dark:text-white"
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
