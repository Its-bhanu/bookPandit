import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";

const AiAstrologyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  });

  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [isHindi, setIsHindi] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatSuggestion = (text) => {
    return text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, index) => <li key={index} className="mb-2">🔹 {line.trim()}</li>);
  };

  const handleTranslate = async () => {
    try {
      const res = await axios.post("https://libretranslate.de/translate", {
        q: suggestion,
        source: "en",
        target: "hi",
        format: "text",
      });
      setSuggestion(res.data.translatedText);
      setIsHindi(true);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuggestion("");
    setIsHindi(false);

    try {
      const response = await axios.post("https://book-pandit-mmed.vercel.app/api/astrology/generate", formData);
      setSuggestion(response.data.suggestion);
    } catch (error) {
      console.error("Error fetching astrology suggestion:", error);
      setSuggestion("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-indigo-600 mb-6"
        >
          AI Astrology Prediction
        </motion.h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md border border-indigo-100"
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-semibold">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-semibold">Birth Time</label>
            <input
              type="time"
              name="birthTime"
              value={formData.birthTime}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1 font-semibold">Birth Place</label>
            <input
              type="text"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition font-semibold"
          >
            {loading ? "Generating..." : "Get Prediction"}
          </button>
        </form>

        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-3xl bg-white p-6 rounded-lg shadow-md border border-indigo-200 text-gray-800"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-indigo-600">Your Astrology Report:</h2>
              {/* {!isHindi && (
                <button
                  onClick={handleTranslate}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-1 rounded-full"
                >
                  Translate to Hindi
                </button>
              )} */}
            </div>
            <ul className="list-disc pl-5 text-gray-700">
              {formatSuggestion(suggestion)}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AiAstrologyForm;
