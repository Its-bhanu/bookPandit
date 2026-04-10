import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { API_BASE } from "../config/api";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [now, setNow] = useState(Date.now());
  const navigate = useNavigate();
  const token = localStorage.getItem("userlogintoken");

  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to view your bookings.");
      navigate("/UserSignIn");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/bookings/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data?.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, token]);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const normalizeStatus = (status) => {
    if (!status) return "Pending";
    const lower = status.toLowerCase();
    if (lower === "accepted") return "Accepted";
    if (lower === "rejected" || lower === "declined") return "Rejected";
    if (lower === "expired") return "Expired";
    if (lower === "pending") return "Pending";
    return status;
  };

  const normalizePaymentStatus = (status) => {
    if (!status) return "Pending";
    const lower = status.toLowerCase();
    if (lower === "completed") return "Completed";
    if (lower === "failed") return "Failed";
    if (lower === "pending") return "Pending";
    return status;
  };

  const getTimeLeft = (createdAt) => {
    const diff = 180000 - (now - new Date(createdAt).getTime());
    return Math.max(0, diff);
  };

  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handlePayment = async (booking) => {
    const razorpayReady = await loadRazorpay();
    if (!razorpayReady) {
      toast.error("Failed to load payment system.");
      return;
    }

    setProcessingPayment(booking._id);

    try {
      const amount = 2100;
      const paymentResponse = await axios.post(
        `${API_BASE}/api/payment/createOrder`,
        { bookingId: booking._id, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = paymentResponse.data.order;
      if (!order?.id) {
        throw new Error("Invalid order response");
      }

      const options = {
        key: "rzp_test_35KFJrJBiuoMh3",
        amount: order.amount,
        currency: "INR",
        name: "Pandit Booking",
        description: "Booking fee",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
              `${API_BASE}/api/payment/verifyPayment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking._id
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verificationResponse.data.success) {
              toast.success("Payment verified successfully!");
              setBookings((prev) =>
                prev.map((item) =>
                  item._id === booking._id
                    ? { ...item, paymentStatus: "Completed" }
                    : item
                )
              );
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed.");
          } finally {
            setProcessingPayment(null);
          }
        },
        prefill: {
          name: booking.name || "",
          contact: booking.phoneNo || ""
        },
        notes: {
          bookingId: booking._id
        },
        theme: { color: "#3399cc" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessingPayment(null);
      });
      rzp1.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed.");
      setProcessingPayment(null);
    }
  };

  const handleChat = (booking) => {
    navigate(`/panditChat/${booking.userId}_${booking.panditId}`, {
      state: {
        roomId: `${booking.userId}_${booking.panditId}`,
        userId: booking.userId,
        panditId: booking.panditId,
        role: "user"
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Bookings</h2>

          {loading ? (
            <div className="text-center text-gray-600">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-500">No bookings found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => {
                const status = normalizeStatus(booking.status);
                const paymentStatus = normalizePaymentStatus(booking.paymentStatus);
                const timeLeft = getTimeLeft(booking.createdAt);

                return (
                  <div key={booking._id} className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800">{booking.poojaType}</h3>
                    <p className="text-gray-600">Pandit: {booking.panditId}</p>
                    <p className="text-gray-600">Date: {booking.date}</p>
                    <p className="text-gray-600">Time: {booking.time}</p>
                    <p className="text-gray-600">Status: {status}</p>
                    <p className="text-gray-600">Payment: {paymentStatus}</p>

                    {status === "Pending" && (
                      <p className="text-gray-600 mt-2">
                        Countdown: {formatTimeLeft(timeLeft)}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      {status === "Accepted" && paymentStatus === "Pending" && (
                        <button
                          onClick={() => handlePayment(booking)}
                          disabled={processingPayment === booking._id}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
                        >
                          {processingPayment === booking._id ? "Processing..." : "Pay ₹21"}
                        </button>
                      )}

                      {status === "Accepted" && (
                        <button
                          onClick={() => handleChat(booking)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Chat Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserBookings;
