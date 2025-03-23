import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const PanditProfilesList = () => {
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || {};

  useEffect(() => {
    const fetchPandits = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/pandits/AllProfiles");
        setPandits(response.data);
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
    try {
      console.log('Sending payload:', { formData, panditId }); // Debugging
      const bookingResponse = await axios.post("http://localhost:4000/api/booking/poojaBooks", { formData, panditId });
      const bookingId = bookingResponse.data.bookingId;
      toast.success("Pooja booking created successfully!");
      handlepayment(bookingId);
    } catch (error) {
      console.error('Error during booking:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || "Error processing booking");
    }
  };

  const handlepayment = async (bookingId) => {
    try {
      const paymentResponse = await axios.post("http://localhost:4000/api/payment/createOrder", { amount: 50, bookingId });
      const { id, amount, currency } = paymentResponse.data;

      const options = {
        key: "rzp_test_2f29o3Omes0sJq", 
        amount,
        currency,
        name: "Pandit Booking",
        description: "Book a Pandit for your ceremony",
        order_id: id,
        handler: async function (response) {
          try {
            await axios.post("http://localhost:4000/api/payment/verifyPayment", { response, bookingId });
            toast.success("Payment successful! Pandit booked.");
            navigate("/feedback");
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error("Error processing booking and payment");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading pandits...</div>;
  if (error) return <div className="text-center text-red-500 text-lg font-semibold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Available Pandits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pandits.map((pandit) => (
          <div key={pandit._id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow">
            <img
              src="https://www.creativehatti.com/wp-content/uploads/edd/2022/11/Indian-pandit-is-sitting-with-greet-hand-2-large.jpg"
              alt="Pandit"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 mb-4"
            />
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">{pandit.fullname}</h3>
              <p className="text-gray-600 mb-1"><strong>Experience:</strong> {pandit.experience} years</p>
              <p className="text-gray-600 mb-1"><strong>Contact:</strong> {pandit.mobile}</p>
              <p className="text-gray-600 mb-1"><strong>Address:</strong> {pandit.address}</p>
              <p className="text-gray-600 mb-3"><strong>Age:</strong> {pandit.age} years</p>
              <p className="text-gray-600 mb-3"><strong>Expertise:</strong> {pandit.expertise}</p>
              <button 
                className="mt-3 px-6 py-2 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
                onClick={() => handleBooking(pandit._id)}
              >
                Pay & Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanditProfilesList;