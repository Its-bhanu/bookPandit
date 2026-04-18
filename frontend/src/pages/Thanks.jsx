import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE } from "../config/api";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("userlogintoken");

  // Get booking data from navigation state
  const bookingData = location.state || {
    bookingId: "",
    panditId: "",
    poojaType: "Pooja Service",
    panditName: "Your Pandit"
  };

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send feedback and rating to the backend
      const feedbackResponse = await axios.post(
        `${API_BASE}/api/bookings/${bookingData.bookingId}/feedback`,
        {
          rating: rating,
          feedback: feedback
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (feedbackResponse.data.success) {
        toast.success("Thank you for your feedback! 🙏");
        setSubmitted(true);
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate("/user/bookings");
        }, 3000);
      } else {
        toast.error("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipFeedback = () => {
    navigate("/user/bookings");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
      >
        <motion.h2
          className="text-4xl font-extrabold text-green-600 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          🎉 Thank You!
        </motion.h2>

        {!submitted ? (
          <>
            <div className="mb-6 text-left bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 text-lg font-semibold">Payment Successful ✅</p>
              <p className="text-gray-600 mt-2">Your booking has been confirmed.</p>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Pooja Type:</span> {bookingData.poojaType}
                </p>
                <p>
                  <span className="font-semibold">Pandit:</span> {bookingData.panditName}
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-lg mb-4">Help us improve! Rate your experience.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  How would you rate our services?
                </label>
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition"
                    >
                      <FaStar
                        className={`text-3xl cursor-pointer transition ${
                          rating >= star ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-yellow-600 mt-2 font-semibold">
                    You rated us {rating} star{rating > 1 ? "s" : ""} ⭐
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Leave your feedback (optional)
                </label>
                <textarea
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm"
                  rows="4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about your experience..."
                ></textarea>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Rating"}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={skipFeedback}
                  className="flex-1 px-6 py-3 bg-gray-400 text-white text-lg font-semibold rounded-xl hover:bg-gray-500 transition duration-300 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Skip
                </motion.button>
              </div>

              {rating === 0 && (
                <p className="text-red-500 text-sm text-center">Please select a rating before submitting.</p>
              )}
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-6"
          >
            <div className="text-5xl mb-4">🙏</div>
            <p className="text-green-600 font-semibold text-lg mb-2">Thank you for your feedback!</p>
            <p className="text-yellow-500 mb-4">
              You rated us {rating} star{rating > 1 ? "s" : ""} ⭐
            </p>
            {feedback && (
              <p className="text-gray-600 italic text-sm mb-4">
                Your feedback: "{feedback}"
              </p>
            )}
            <p className="text-gray-600">Redirecting to your bookings...</p>
          </motion.div>
        )}

        {!submitted && (
          <motion.button
            className="mt-8 px-6 py-2 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition duration-300 shadow-md"
            onClick={() => navigate("/user/bookings")}
            whileHover={{ scale: 1.05 }}
          >
            Back to Bookings
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
