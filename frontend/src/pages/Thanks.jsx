import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center"
      >
        <motion.h2 
          className="text-4xl font-extrabold text-green-600 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          🎉 Thank You!
        </motion.h2>
        <p className="text-gray-700 text-lg">Your booking has been successfully confirmed.</p>
        <p className="text-gray-600 mt-2">We appreciate your trust in our service. A confirmation has been sent to your provided contact details.</p>

        {submitted ? (
          <motion.p 
            className="text-green-600 font-semibold mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Thank you for your feedback! 🙏
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Leave your feedback:</label>
            <textarea
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              rows="3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
            <motion.button
              type="submit"
              className="mt-3 px-6 py-2 bg-green-600 text-white text-lg rounded-xl hover:bg-green-700 transition duration-300 shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              Submit Feedback
            </motion.button>
          </form>
        )}

        <motion.button
          className="mt-6 px-6 py-2 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition duration-300 shadow-md"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
