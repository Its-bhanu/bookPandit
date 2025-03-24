import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PanditHomePage from "./PanditHome";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css";
const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

    const [Error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://book-pandit-mmed.vercel.app//api/pandits/login", formData);
      console.log("response data", response.data);
      localStorage.setItem("panditsignintoken", response.data.token);
      toast.success("Sign-in successful!")
     
        navigate("/panditHome");
   
      
      
    } 
    catch (error) {
      console.log("error", error);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
      toast.error(error.response?.data?.message || "Signup failed. Please try again.")
      setError(error.response.data.message);
    }
   
    
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 bg-yellow-100 text-bold">Pandit Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account? <Link to="/PanditSignup" className="text-blue-600 hover:underline">Sign Up</Link>
          </p>
          <p className="text-center text-sm text-gray-600 mt-4">
            <Link to="/pandit/forgetpassword" className="text-blue-600 hover:underline">Forget Password</Link>
          </p>
        </form>
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

export default Signin;
