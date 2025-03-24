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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [Error,setError]=useState("");
  const navigate=useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();

    // try{

    //   const response=await axios.post("https://book-pandit-mmed.vercel.app/api/booking/poojaBooks", formData)
    //   console.log("response data", response.data);
    //         localStorage.setItem("BookingToken", response.data.token);
    //         toast.success("please wait we find a best pandit in your region");
    // }
    // catch(error){
    //   console.log("error", error);
    //         setError(error.response?.data?.message || "Sorry");
    //         toast.error(error.response?.data?.message || "Sorry ")
    //         setError(error.response.data.message);
    // }

    navigate('/panditProfile', { state: { formData } });
    };

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Book a Pooja</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-4 border rounded-lg"
                />
                <input
                    type="tel"
                    name="phoneNo"
                    placeholder="Phone Number"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-4 border rounded-lg"
                />
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
                </select>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-4 border rounded-lg"
                />
                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-4 border rounded-lg"
                />
                <textarea
                    name="address"
                    placeholder="Enter Address"
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
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Book Now
          
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
