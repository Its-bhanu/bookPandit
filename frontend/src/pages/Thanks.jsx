import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send feedback and rating to the backend here if needed
    console.log("Feedback:", feedback);
    console.log("Rating:", rating);

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
        <p className="text-gray-600 mt-2">We appreciate your trust in our service.</p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <p className="text-green-600 font-semibold">Thank you for your feedback! 🙏</p>
            <p className="text-yellow-500 mt-1">
              You rated us {rating} star{rating > 1 && 's'} ⭐
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">Rate your experience:</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer text-2xl ${
                      rating >= star ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">Leave your feedback:</label>
              <textarea
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                rows="3"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              ></textarea>
            </div>

            <motion.button
              type="submit"
              className="w-full px-6 py-2 bg-green-600 text-white text-lg rounded-xl hover:bg-green-700 transition duration-300 shadow-md"
              whileHover={{ scale: 1.05 }}
              disabled={rating === 0}
            >
              Submit Feedback
            </motion.button>
            {rating === 0 && (
              <p className="text-red-500 text-sm text-center">Please select a rating before submitting.</p>
            )}
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
