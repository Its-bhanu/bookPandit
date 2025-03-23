import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h2>
        <p className="text-gray-700 mb-4">Your booking has been successfully confirmed.</p>
        <p className="text-gray-600">We appreciate your trust in our service. A confirmation has been sent to your provided contact details.</p>
        
        {submitted ? (
          <p className="text-green-600 font-semibold mt-4">Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Leave your feedback:</label>
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="mt-3 px-6 py-2 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition duration-300"
            >
              Submit Feedback
            </button>
          </form>
        )}
        
        <button 
          className="mt-6 px-6 py-2 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
