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

  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || {};

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchPandits = async () => {
      try {
        const response = await axios.get("https://book-pandit-mmed.vercel.app/api/pandits/AllProfiles");
        const panditonly=response.data.filter(pandit=>{
          const expertise = pandit.expertise ?.toLowerCase() || "";
           return (expertise.includes('pandit')) 

        })
        setPandits(panditonly);
        toast.success("Pandit profiles loaded successfully!");
      } catch (error) {
        setError("Failed to fetch pandit profiles");
        toast.error("Error fetching pandit profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchPandits();
  }, []);

  const handleBooking = async (panditId) => {
    setProcessingPayment(true);
    setProcessingPanditId(panditId);
    try {
      const bookingResponse = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/booking/poojaBooks", 
        { formData, panditId }
      );
      const bookingId = bookingResponse.data.booking._id;
      toast.success("Pooja booking created successfully!");
      handlePayment(bookingId);
    } catch (error) {
      console.error('Error during booking:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || "Error processing booking");
      setProcessingPayment(false);
      setProcessingPanditId(null);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const paymentResponse = await axios.post(
        "https://book-pandit-mmed.vercel.app/api/payment/createOrder", 
        { bookingId, amount: 2100 }
      );
      navigate("/feedback");

      const { id } = paymentResponse.data;

      const options = {
        key: "rzp_test_2f29o3Omes0sJq",
        amount: 2100,
        currency: "INR",
        name: "Pandit Booking",
        description: "Book a Pandit for your ceremony",
        order_id: id,
        handler: async function (response) {
          try {
            await axios.post("https://book-pandit-mmed.vercel.app/api/payment/verifyPayment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });
            toast.success("Payment verified! Pandit successfully booked.");
            navigate("/feedback");
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed.");
          } finally {
            setProcessingPayment(false);
            setProcessingPanditId(null);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email || "",
          contact: formData.phoneNo || "",
        },
        theme: { color: "#3399cc" },
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessingPayment(false);
        setProcessingPanditId(null);
      });
      rzp1.open();
    } catch (error) {
      toast.error("Error processing booking and payment");
      setProcessingPayment(false);
      setProcessingPanditId(null);
    }
  };

  // Filter pandits based on search and expertise
  const filteredPandits = pandits.filter(pandit => {
    const matchesSearch = pandit.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pandit.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pandit.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = selectedExpertise === "all" || 
                           pandit.expertise.toLowerCase().includes(selectedExpertise.toLowerCase());

                     
    return matchesSearch && matchesExpertise;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Find Your Perfect Pandit
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Browse our verified pandits and book for your pooja ceremony,
            <br />" And Here you can find pandits using your location ,expertise and name.."
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search pandits..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* <select
              className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
            >
              <option value="all">Astrologer</option>
              <option value="marriage">Pandit</option>
              <option value="griha pravesh">Palmistry</option>
              <option value="satyanarayan">Black Magic</option>
              <option value="havan">Vashikaran</option>
            </select> */}
          </motion.div>
        </div>

        {/* Pandit Cards */}
        {filteredPandits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPandits.map((pandit) => (
              <motion.div
                key={pandit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={pandit.profileImage || "https://www.creativehatti.com/wp-content/uploads/edd/2022/11/Indian-pandit-is-sitting-with-greet-hand-2-large.jpg"}
                      alt={pandit.fullname}
                      className="w-32 h-32 object-cover rounded-full border-4 border-green-100 mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-800 text-center">{pandit.fullname}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-gray-600 text-sm ml-1">(24)</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700"><strong>Expertise:</strong> {pandit.expertise}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700"><strong>Experience:</strong> {pandit.experience} years</span>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700"><strong>Location:</strong> {pandit.address}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700"><strong>Contact:</strong> {pandit.mobile}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-900">₹21</span>
                      <span className="text-sm text-gray-500">Booking Fee</span>
                    </div>
                    
                    <button
                      onClick={() => handleBooking(pandit._id)}
                      disabled={processingPayment && processingPanditId === pandit._id}
                      className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-colors duration-300 ${
                        processingPayment && processingPanditId === pandit._id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {processingPayment && processingPanditId === pandit._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Pay & Book Now"
                      )}
                    </button>
                    
                    <button className="w-full mt-3 py-2.5 text-green-600 font-medium rounded-lg border border-green-600 hover:bg-green-50 transition-colors duration-300">
                      View Full Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No pandits found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanditProfilesList;