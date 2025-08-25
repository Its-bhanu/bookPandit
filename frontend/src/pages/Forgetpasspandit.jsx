import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // loader
  const navigate = useNavigate();

  // Handle sending OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/pandit/forget-password",
        { email }
      );
      setMessage(response.data.message);
      setStep(2); // Move to OTP step
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP!");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/pandit/verify-otp",
        { email, otp }
      );
      setMessage(response.data.message);
      setStep(3); // OTP verified -> go to reset password step
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/pandit/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      setMessage(response.data.message);

      // ✅ navigate after success
      if (response.data.success) {
        navigate("/PanditSignIn");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {step === 1 && "Forget Password"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {message && <p className="text-center text-red-500">{message}</p>}

        {loading && (
          <div className="flex justify-center my-3">
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Send OTP
            </button>
          </form>
        )}

        {!loading && step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Verify OTP
            </button>
          </form>
        )}

        {!loading && step === 3 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Reset Password
            </button>
          </form>
        )}

        <p className="text-sm text-gray-600 mt-4 text-center">
          Remember your password?{" "}
          <a href="/PanditSignIn" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
