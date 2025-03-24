import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css";

const PanditSignup = () => {
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
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null); // Store user ID after signup
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://book-pandit-mmed.vercel.app//api/pandits/register", formData);

      console.log("Signup Response:", response.data);
      setUserId(response.data.userId); // Save user ID
      setIsOtpSent(true); // Show OTP section
      toast.success("OTP sent to your email. Please verify.")
    } catch (error) {
      console.error(error);
      toast.error(error)
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://book-pandit-mmed.vercel.app//api/pandits/verify-otp", { userId, otp });

      console.log("OTP Verification Response:", response.data);
      toast.success("Signup successful! Please sign in.")
      // navigate("/PanditSignin");
      setTimeout(() => {
        navigate("/PanditSignin");
    }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.")
      setError(error.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">{isOtpSent ? "Verify OTP" : "Register As a Pandit"}</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!isOtpSent ? (
          // Signup Form
          <form onSubmit={handleSignup}>
            <input type="text" name="fullname" placeholder="Full Name*" value={formData.fullname} onChange={handleChange} className="w-full p-2 mb-4 border rounded-xl" required />
            <input type="text" name="mobile" placeholder="Mobile*" value={formData.mobile} onChange={handleChange} className="w-full p-2 mb-4 border rounded-xl" required />
            <input type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleChange} className="w-full p-2 mb-4 border rounded-xl" required />
            <input type="text" name="experience" placeholder="Experience*" value={formData.experience} onChange={handleChange} className="w-full p-2 mb-4 border rounded-xl" required />
            <input type="number" name="age" placeholder="Age*" value={formData.age} onChange={handleChange} className="w-full p-2 mb-4 border rounded-xl" required />
            <input type="text" name="address" placeholder="Address*" value={formData.address} onChange={handleChange} className="w-full p-2 mb-4 border rounded-xl" required />
            <input type="password" name="password" placeholder="Password*" value={formData.password} onChange={handleChange} className="w-full p-2 mb-4 border rounded-xl" required />
            <input type="text" name="expertise" placeholder="Expertise*" value={formData.expertise} onChange={handleChange} className="w-full p-2 mb-4 border rounded-xl" required />
            <button type="submit" className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300">
              SIGN UP
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account? <Link to="/PanditSignin" className="text-blue-600 hover:underline">Sign in</Link>
            </p>
          </form>
          
        ) : (
          // OTP Verification Form
          <form onSubmit={handleVerifyOtp}>
            <input type="text" name="otp" placeholder="Enter OTP*" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-2 mb-4 border rounded-xl" required />

            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
              VERIFY OTP
            </button>
          </form>
        )}
        <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
      </div>
    </div>
  );
};

export default PanditSignup;
