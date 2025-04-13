import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PanditSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    mobile: "",
    email: "",
    experience: "",
    age: "",
    address: "",
    password: "",
    expertise: "",
  });

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/pandits/register",
        formData
      );
      setUserId(response.data.userId);
      setIsOtpSent(true);
      toast.success("OTP sent to your email. Please verify.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://book-pandit-mmed.vercel.app/api/pandits/verify-otp", {
        userId,
        otp,
      });
      toast.success("Signup successful! Redirecting...");
      setTimeout(() => navigate("/PanditSignin"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isOtpSent ? "Verify OTP" : "Register As a Pandit"}
        </h2>

        {!isOtpSent ? (
          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name*"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded-lg"
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile*"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded-lg"
              required
            />
            <input
              type="text"
              name="experience"
              placeholder="Experience (e.g., 5 years)*"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded-lg"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age*"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded-lg"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address*"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded-lg"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password*"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded-lg"
              required
            />
            <select
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-lg"
              required
            >
              <option value="">Select Expertise*</option>
              <option value="Pandit">Pandit</option>
              <option value="Astrologer">Astrologer</option>
              <option value="Vastu Consultant">Vastu Consultant</option>
              <option value="Numerologist">Numerologist</option>
              <option value="Palmist">Palmist</option>
            </select>

            <button
              type="submit"
              className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              SIGN UP
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/PanditSignin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP*"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              VERIFY OTP
            </button>
          </form>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default PanditSignup;
