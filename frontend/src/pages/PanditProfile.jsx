import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PanditProfilesList = () => {
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingPanditId, setProcessingPanditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("all");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || {};

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    
    script.onload = () => {
      setRazorpayLoaded(true);
      console.log("Razorpay script loaded successfully");
    };
    
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast.error("Payment system failed to load. Please refresh the page.");
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch pandits data
  useEffect(() => {
    const fetchPandits = async () => {
      try {
        const response = await axios.get(
          "https://book-pandit-mmed.vercel.app/api/pandits/AllProfiles"
        );
        const panditonly = response.data.filter(pandit => {
          const expertise = pandit.expertise?.toLowerCase() || "";
          return expertise.includes('pandit');
        });
        setPandits(panditonly);
      } catch (error) {
        setError("Failed to fetch pandit profiles");
        console.error("Fetch error:", error);
        toast.error("Error fetching pandit profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchPandits();
  }, []);

  // Handle booking and payment flow
  const handleBooking = async (panditId) => {
    if (!razorpayLoaded) {
      toast.error("Payment system is still loading. Please wait...");
      return;
    }

    if (!formData || !panditId) {
      toast.error("Missing required booking information");
      return;
    }

    setProcessingPayment(true);
    setProcessingPanditId(panditId);

    try {
      console.log("Creating booking with:", { formData, panditId });
      
      // Step 1: Create booking
      const bookingResponse = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/booking/poojaBooks",
        { formData, panditId },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Booking response:", bookingResponse.data);
      
      if (!bookingResponse.data.booking?._id) {
        throw new Error("Failed to get booking ID from response");
      }

      const bookingId = bookingResponse.data.booking._id;
      
      // Step 2: Create payment order
      await handlePayment(bookingId);
    } catch (error) {
      console.error("Booking error:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      toast.error(
        error.response?.data?.message || 
        "Failed to create booking. Please try again."
      );
    } finally {
      if (!processingPayment) {
        setProcessingPayment(false);
        setProcessingPanditId(null);
      }
    }
  };

  // Handle payment process
  const handlePayment = async (bookingId) => {
    try {
      console.log("Creating payment order for booking:", bookingId);
      
      const paymentResponse = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/payment/createOrder",
        { bookingId },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      console.log("Payment order response:", paymentResponse.data);
      
      if (!paymentResponse.data.order?.id) {
        throw new Error("Invalid order response from server");
      }

      const { id: orderId } = paymentResponse.data.order;

      // Initialize Razorpay payment
      const options = {
        key: "rzp_test_2f29o3Omes0sJq",
        amount: 2100 * 100, // Amount in paise
        currency: "INR",
        name: "Pandit Booking Service",
        description: "Booking payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            console.log("Payment success response:", response);
            
            const verificationResponse = await axios.post(
              "https://book-pandit-mmed.vercel.app/api/payment/verifyPayment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingId
              }
            );

            console.log("Verification response:", verificationResponse.data);
            
            if (verificationResponse.data.success) {
              toast.success("Payment verified successfully!");
              navigate("/feedback", {
                state: { 
                  bookingId,
                  paymentStatus: "success"
                }
              });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed");
          } finally {
            setProcessingPayment(false);
            setProcessingPanditId(null);
          }
        },
        prefill: {
          name: formData.name || "",
          email: formData.email || "",
          contact: formData.phoneNo || ""
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp1 = new window.Razorpay(options);
      
      rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessingPayment(false);
        setProcessingPanditId(null);
      });

      rzp1.open();
    } catch (error) {
      console.error("Payment error:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      toast.error(
        error.response?.data?.error?.details || 
        error.response?.data?.error ||
        "Payment processing failed"
      );
      setProcessingPayment(false);
      setProcessingPanditId(null);
    }
  };

  // Filter pandits based on search
  const filteredPandits = pandits.filter(pandit => {
    const matchesSearch = pandit.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pandit.expertise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pandit.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = selectedExpertise === "all" || 
                           pandit.expertise?.toLowerCase().includes(selectedExpertise.toLowerCase());
                     
    return matchesSearch && matchesExpertise;
  });

  // Loading state
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="text-center py-10">
      <div className="text-red-500 text-lg font-semibold">{error}</div>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Retry
      </button>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header and search section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Find Your Perfect Pandit
          </motion.h1>
          
          <motion.div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search pandits..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>

        {/* Pandit listings */}
        {filteredPandits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPandits.map((pandit) => (
              <motion.div
                key={pandit._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Pandit card content */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleBooking(pandit._id)}
                      disabled={processingPayment && processingPanditId === pandit._id}
                      className={`w-full py-3 rounded-lg font-medium ${
                        processingPayment && processingPanditId === pandit._id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {processingPayment && processingPanditId === pandit._id ? (
                        "Processing..."
                      ) : (
                        "Book Now"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No pandits found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanditProfilesList;