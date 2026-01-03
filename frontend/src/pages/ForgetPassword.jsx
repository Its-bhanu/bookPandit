import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const navigate = useNavigate();

  /* -----------------------------------
     BLOCK BACK NAVIGATION AFTER RESET
  ------------------------------------ */
  useEffect(() => {
    if (resetSuccess) {
      window.history.pushState(null, "", window.location.href);

      window.onpopstate = () => {
        navigate("/UserSignIn", { replace: true });
      };
    }

    return () => {
      window.onpopstate = null;
    };
  }, [resetSuccess, navigate]);

  /* -----------------------------------
     SEND OTP
  ------------------------------------ */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/user/forget-password",
        { email }
      );

      toast.success(res.data.message || "OTP sent successfully!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP!");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------
     VERIFY OTP
  ------------------------------------ */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/user/verify-otp",
        { email, otp }
      );

      toast.success(res.data.message || "OTP verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------
     RESET PASSWORD
  ------------------------------------ */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/user/reset-password",
        { email, otp, newPassword }
      );

      toast.success(res.data.message || "Password reset successful!");
      setResetSuccess(true);

      // 🔥 Replace history so back button won't return here
      setTimeout(() => {
        navigate("/UserSignIn", { replace: true });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed!");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------
     UI
  ------------------------------------ */
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

        {/* STEP 1 */}
        {step === 1 && !loading && (
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
              Send OTP
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && !loading && (
          <form onSubmit={handleOtpSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
              Verify OTP
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && !loading && (
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
              required
              minLength={6}
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
              Reset Password
            </button>
          </form>
        )}

        {/* Login Link (disabled after success) */}
        {!resetSuccess && (
          <p className="text-sm text-gray-600 mt-4 text-center">
            Remember your password?{" "}
            <Link to='/UserSignIn'
            className="text-blue-500 hover:underline">Sign In</Link>
          </p>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ForgetPassword;
