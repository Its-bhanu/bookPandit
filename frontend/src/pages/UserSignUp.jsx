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
    const [loading, setLoading] = useState(false);           // Signup button loader
    const [otpLoading, setOtpLoading] = useState(false);     // OTP button loader
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Start loader

        try {
            const response = await axios.post(" https://book-pandit-mmed.vercel.app/api/users/register", formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.message === "OTP sent to email") {
                toast.success("OTP sent to your email! Please verify.");
                setIsOtpSent(true);
            } else {
                setError("Invalid signup response. Please try again.");
                toast.error("Invalid signup response. Please try again.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed. Please try again.");
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false); 
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setOtpLoading(true); // Start loader

        try {
            const response = await axios.post(" https://book-pandit-mmed.vercel.app/api/users/verify-otp", {
                email: formData.email,
                otp
            });

            toast.success("OTP verified! Redirecting to login...");
            navigate('/UserSignin');
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed.");
        } finally {
            setOtpLoading(false); // Stop loader
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                    {isOtpSent ? "Verify OTP" : "Register As a User"}
                </h2>

                {!isOtpSent ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            disabled={loading}
                            className={`w-full text-white py-2 rounded-md transition duration-200 ${
                                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center space-x-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    <span>Signing Up...</span>
                                </div>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
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
                            disabled={otpLoading}
                            className={`w-full text-white py-2 rounded-md transition duration-200 ${
                                otpLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                            {otpLoading ? (
                                <div className="flex justify-center items-center space-x-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>
                    </form>
                )}

                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default UserSignUp;
