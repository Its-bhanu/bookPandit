import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle OTP input
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    // Handle signup submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            console.log("Submitting Form Data:", formData);
            const response = await axios.post("https://book-pandit-mmed.vercel.app//api/users/register", formData, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("Response Data:", response.data);

            if (response.data.message === "OTP sent to email") {
                toast.success("OTP sent to your email! Please verify.");
                setIsOtpSent(true); // Show OTP input field
            } else {
                setError("Invalid signup response. Please try again.");
                toast.error("Invalid signup response. Please try again.");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            setError(error.response?.data?.message || "Signup failed. Please try again.");
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    // Handle OTP verification
    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Submitting OTP:", otp);
            const response = await axios.post("https://book-pandit-mmed.vercel.app//api/users/verify-otp", { 
                email: formData.email, 
                otp 
            });

            console.log("OTP Verification Response:", response.data);

                toast.success("OTP verified! Redirecting to login...");

                navigate('/UserSignin')
        } catch (error) {
            console.error("OTP Verification Error:", error);
            toast.error(error.response?.data?.message || "OTP verification failed.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                    {isOtpSent ? "Verify OTP" : "Register As a User"}
                </h2>

                {!isOtpSent ? (
                    // Signup Form
                    <form onSubmit={((e) => {handleSubmit(e)})} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Username"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Email"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Password"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Sign Up
                        </button>
                    </form>
                ) : (
                    // OTP Verification Form
                    <form onSubmit={(e) => handleOtpSubmit(e)} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                onChange={handleOtpChange}
                                required
                                placeholder="Enter OTP"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}

                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default UserSignUp;