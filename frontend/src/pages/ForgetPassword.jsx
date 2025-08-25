import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle sending OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/user/forget-password",
        { email }
      );
      toast.success(response.data.message || "OTP sent successfully!");
      setStep(2); // Move to OTP step
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP!");
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
        "https://book-pandit-mmed.vercel.app/api/user/verify-otp",
        { email, otp }
      );
      toast.success(response.data.message || "OTP verified!");
      setStep(3); // Move to Reset Password step
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP!");
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
        "https://book-pandit-mmed.vercel.app/api/user/reset-password",
        { email, otp, newPassword }
      );

      toast.success(response.data.message || "Password reset successful!");

      // ✅ navigate after success with delay so toast is visible
      setTimeout(() => {
        navigate("/UserSignIn");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password!");
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

        {/* Loader */}
        {loading && (
          <div className="flex justify-center my-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {step === 1 && !loading && (
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

        {step === 2 && !loading && (
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

        {step === 3 && !loading && (
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
          <a href="/UserSignIn" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>

      {/* ✅ Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ForgetPassword;
