import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { API_BASE, SOCKET_BASE } from "../config/api";

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
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("userlogintoken");
  const userId = localStorage.getItem("userId");

  // Initialize Socket Connection
  useEffect(() => {
    if (!token || !userId) return;

    const newSocket = io(SOCKET_BASE, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("User connected to socket:", newSocket.id);
      // Join the user room
      newSocket.emit("join_user_room", { userId });
    });

    // Listen for booking acceptance
    newSocket.on("booking_accepted_notification", (data) => {
      console.log("Booking accepted notification:", data);
      toast.success(data.message || "Your booking has been accepted! 🎉");
      
      // Update the booking status in the local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === data.bookingId ? { ...booking, status: "Accepted" } : booking
        )
      );
    });

    // Listen for booking rejection
    newSocket.on("booking_rejected_notification", (data) => {
      console.log("Booking rejected notification:", data);
      toast.error(data.message || "Your booking has been declined.");
      
      // Update the booking status
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === data.bookingId ? { ...booking, status: "Rejected" } : booking
        )
      );

      // After 2 seconds, navigate to sorry page
      setTimeout(() => {
        navigate("/Sorry", {
          state: { message: data.message || "Your booking request was declined by the pandit." }
        });
      }, 2000);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, userId, navigate]);

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
              toast.success("Payment verified successfully! 🎉");
              setBookings((prev) =>
                prev.map((item) =>
                  item._id === booking._id
                    ? { ...item, paymentStatus: "Completed" }
                    : item
                )
              );
              
              // Navigate to Thank You page with booking details
              setTimeout(() => {
                navigate("/feedback", {
                  state: {
                    bookingId: booking._id,
                    panditId: booking.panditId,
                    poojaType: booking.poojaType,
                    panditName: booking.panditName || "Your Pandit"
                  }
                });
              }, 1000);
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800 border-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "Expired":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  const getPaymentStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Failed":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Pending":
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">My Bookings</h2>
          <p className="text-center text-gray-600 mb-8">Manage your pandit bookings and payments</p>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your bookings...</p>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg mb-4">No bookings yet</p>
              <button
                onClick={() => navigate("/poojaBooks")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Browse Pandits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bookings.map((booking) => {
                const status = normalizeStatus(booking.status);
                const paymentStatus = normalizePaymentStatus(booking.paymentStatus);
                const timeLeft = getTimeLeft(booking.createdAt);
                const isExpired = status === "Pending" && timeLeft <= 0;

                return (
                  <div
                    key={booking._id}
                    className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition transform hover:scale-105 duration-200"
                  >
                    {/* Header with Pooja Type and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">{booking.poojaType}</h3>
                        <p className="text-gray-600 text-sm mt-1">with {booking.panditName || booking.panditId}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                            isExpired ? "Expired" : status
                          )}`}
                        >
                          {isExpired ? "Expired" : status}
                        </span>
                        {paymentStatus !== "Pending" && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusBadgeColor(
                              paymentStatus
                            )}`}
                          >
                            {paymentStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date</p>
                        <p className="text-gray-800 font-medium">{booking.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Time</p>
                        <p className="text-gray-800 font-medium">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Name</p>
                        <p className="text-gray-800 font-medium">{booking.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Phone</p>
                        <p className="text-gray-800 font-medium">{booking.phoneNo}</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Address</p>
                      <p className="text-gray-700">{booking.address}</p>
                    </div>

                    {/* Countdown for Pending Bookings */}
                    {status === "Pending" && !isExpired && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-700 font-semibold mb-1">Waiting for pandit response...</p>
                        <p className="text-xl font-bold text-yellow-600">{formatTimeLeft(timeLeft)}</p>
                        <p className="text-xs text-yellow-600 mt-1">Booking expires if not accepted</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:gap-3">
                      {status === "Accepted" && paymentStatus === "Pending" && (
                        <button
                          onClick={() => handlePayment(booking)}
                          disabled={processingPayment === booking._id}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-400 transition transform hover:scale-105 shadow-md"
                        >
                          {processingPayment === booking._id ? (
                            <span className="flex items-center justify-center">
                              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                              Processing...
                            </span>
                          ) : (
                            "💳 Pay ₹21"
                          )}
                        </button>
                      )}

                      {status === "Accepted" && (
                        <button
                          onClick={() => handleChat(booking)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 shadow-md"
                        >
                          💬 Chat Now
                        </button>
                      )}

                      {status === "Pending" && !isExpired && (
                        <p className="text-xs text-gray-500 italic text-center py-2 w-full">
                          Waiting for pandit to respond...
                        </p>
                      )}

                      {status === "Rejected" && (
                        <p className="text-xs text-red-600 font-semibold text-center py-2 w-full">
                          ❌ Booking was declined
                        </p>
                      )}

                      {status === "Expired" && (
                        <p className="text-xs text-gray-600 font-semibold text-center py-2 w-full">
                          ⏱️ Booking request expired
                        </p>
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
