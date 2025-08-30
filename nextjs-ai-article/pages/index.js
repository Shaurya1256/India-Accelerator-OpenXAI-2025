
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("funny");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const generateArticle = async () => {
    if (!topic) return alert("Please enter a topic!");
    setLoading(true);
    setArticle("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, length }),
      });

      const data = await res.json();
      if (data.article) {
        setArticle(data.article);
        setHistory([{ topic, article: data.article }, ...history]);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating article!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article);
    alert("📋 Article copied to clipboard!");
  };

  const clearHistory = () => setHistory([]);

  // 🗣️ Speak the article
  const speakArticle = () => {
    if (!article) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(article);
    utterance.lang = "en-US";
    utterance.rate = 1; // speed (0.5 - 2)
    utterance.pitch = 1; // voice pitch
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
      style={{
        cursor:
          "url('https://cur.cursors-4u.net/cursors/cur-2/cur116.cur'), auto",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <motion.h1
            className="text-3xl font-bold"
            whileHover={{ scale: 1.05 }}
          >
            📝 AI Article Generator
          </motion.h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>

        {/* Input Form */}
        <motion.div
          className={`p-4 rounded-lg shadow space-y-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <input
            type="text"
            placeholder="Enter a topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={`w-full px-4 py-2 rounded border focus:ring-2 focus:ring-indigo-500 transition ${
              darkMode ? "bg-gray-700 text-white border-gray-600" : ""
            }`}
          />

          <div className="flex space-x-4">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`flex-1 px-4 py-2 border rounded hover:shadow-md transition ${
                darkMode ? "bg-gray-700 text-white border-gray-600" : ""
              }`}
            >
              <option value="funny">😂 Funny</option>
              <option value="professional">💼 Professional</option>
              <option value="casual">😎 Casual</option>
              <option value="informative">📚 Informative</option>
            </select>

            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className={`flex-1 px-4 py-2 border rounded hover:shadow-md transition ${
                darkMode ? "bg-gray-700 text-white border-gray-600" : ""
              }`}
            >
              <option value="short">✏️ Short</option>
              <option value="medium">📰 Medium</option>
              <option value="long">📖 Long</option>
            </select>
          </div>

          <button
            onClick={generateArticle}
            disabled={loading}
            className="w-full px-4 py-2 rounded bg-indigo-600 text-white font-semibold shadow hover:scale-105 hover:bg-indigo-700 transition"
          >
            {loading ? "⏳ Generating..." : "✨ Generate Article"}
          </button>
        </motion.div>

        {/* Output */}
        {article && (
          <motion.div
            className={`p-4 rounded-lg shadow space-y-4 ${
              darkMode ? "bg-gray-700" : "bg-green-50"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold flex justify-between items-center">
              Generated Article
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 text-sm rounded bg-indigo-500 text-white hover:bg-indigo-600 transition"
                >
                  📋 Copy
                </button>
                <button
                  onClick={speakArticle}
                  className="px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600 transition"
                >
                  {isSpeaking ? "⏹ Stop" : "🔊 Read"}
                </button>
              </div>
            </h2>
            <p>{article}</p>
          </motion.div>
        )}

        {/* History */}
        {history.length > 0 && (
          <motion.div
            className={`p-4 rounded-lg shadow space-y-3 ${
              darkMode ? "bg-gray-800" : "bg-blue-50"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">📜 History</h2>
              <button
                onClick={clearHistory}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                🗑 Clear
              </button>
            </div>
            {history.map((h, i) => (
              <motion.div
                key={i}
                className="p-2 border-b cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-bold">{h.topic}</p>
                <p className="text-sm">{h.article.slice(0, 120)}...</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
