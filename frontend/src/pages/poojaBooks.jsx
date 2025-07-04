import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css";

const PoojaBooks = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    poojaType: "",
    date: "",
    time: "",
    address: "",
    message: "",
  });

  const [Error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [minDate, setMinDate] = useState(getTodayDate());
  const [minTime, setMinTime] = useState(getCurrentTime());

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "date" && value === getTodayDate()) {
      setMinTime(getCurrentTime());
    } else if (name === "date") {
      setMinTime("00:00");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when form is submitted

    const selectedDate = new Date(formData.date + "T" + formData.time);
    const now = new Date();

    if (selectedDate < now) {
      toast.error("Please select a future date and time.");
      setIsLoading(false); // Reset loading if validation fails
      return;
    }

    try {
      // Simulate API call delay (remove this in production)
      await new Promise(resolve => setTimeout(resolve, 1000));
      


      navigate('/panditProfile', { state: { formData } });
    } catch (error) {
      console.log("error", error);
      setError(error.response?.data?.message || "Sorry");
      toast.error(error.response?.data?.message || "Sorry ");
      setError(error.response.data.message);
    } finally {
      setIsLoading(false); // Reset loading state in any case
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Book a Pooja</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-1 text-sm font-medium text-gray-700">
  Full Name
</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border rounded-lg"
          />
          <label className="block mb-1 text-sm font-medium text-gray-700">
  Phone Number
</label>
          <input
            type="tel"
            name="phoneNo"
            placeholder="Phone Number"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border rounded-lg"
          />
          <label className="block mb-1 text-sm font-medium text-gray-700">
  Select Pooja Type
</label>
          <select
            name="poojaType"
            value={formData.poojaType}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border rounded-lg"
          >
            <option value="">Select Pooja Type</option>
            <option value="Griha Pravesh">Griha Pravesh</option>
            <option value="Satyanarayan Pooja">Satyanarayan Pooja</option>
            <option value="Marriage Pooja">Marriage Pooja</option>
            <option value="Havan">Havan</option>
            <option value="sundarkand">Hanuman Sundarkand </option>
            <option value="ramayan">Ramayan Paath</option>
            <option value="Sandhya Vandanam ">Sandhya Vandanam </option>
            <option value="Navagraha Pooja">Navagraha Pooja</option>
            <option value="Vastu Shanti Pooja">Vastu Shanti Pooja</option>
            <option value="Maha Mrityunjaya Pooja">Maha Mrityunjaya Pooja</option>
            <option value="Chandi Havan">Chandi Havan</option>
            <option value="Navaratri Pooja">Navaratri Pooja</option>
            <option value="Shree Yantra Pooja">Shree Yantra Pooja</option>
            <option value="Katha">Katha</option>
            <option value="Pitra Dosh Pooja">Pitra Dosh Pooja</option>
            <option value="Kaal Sarp Dosh Pooja">Kaal Sarp Dosh Pooja</option>
            <option value="Rudrabhishek">Rudrabhishek</option>
            <option value="Shanti Pooja">Shanti Pooja</option>
            <option value="Ganesh Pooja">Ganesh Pooja</option>
            <option value="Navchandi Pooja">Navchandi Pooja</option>
            <option value="Durga Saptashati">Durga Saptashati</option>
            <option value="Laxmi Pooja">Laxmi Pooja</option>
             <option value="Diwali Pooja">Diwali Pooja</option>
            
            <option value="Other">Other</option>
          </select>
          <label className="block mb-1 text-sm font-medium text-gray-700">
  Pooja Date
</label>
<input
  type="date"
  name="date"
  min={minDate}
  value={formData.date}
  onChange={handleChange}
  required
  className="w-full p-2 mb-4 border rounded-lg"
/>

<label className="block mb-1 text-sm font-medium text-gray-700">
  Pooja Time
</label>
<input
  type="time"
  name="time"
  min={formData.date === minDate ? minTime : undefined}
  value={formData.time}
  onChange={handleChange}
  required
  className="w-full p-2 mb-4 border rounded-lg"
/>
<label className="block mb-1 text-sm font-medium text-gray-700">
 Full Address
</label>
          <textarea
            name="address"
            placeholder="Enter Full Address with your house number, street, city, and state"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border rounded-lg"
          ></textarea>
          <textarea
            name="message"
            placeholder="Enter A message Regarding Pooja Price and Pandit"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded-lg"
          ></textarea>

          <button
            type="submit"
            disabled={isLoading} // Disable button when loading
            className={`w-full py-2 rounded-lg transition duration-300 ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Book Now"
            )}
          </button>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={3000}
        />
      </div>
    </div>
  );
};

export default PoojaBooks;