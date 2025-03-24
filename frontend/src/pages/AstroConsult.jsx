import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AstrologyConsultPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     dateOfBirth: "",
//     query: ""
//   });
  const [message, setMessage] = useState("");
  const [astrologers, setAstrologers] = useState([]);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await axios.get("https://book-pandit-mmed.vercel.app/api/pandits/AllProfiles");
        setAstrologers(response.data);
      } catch (error) {
        console.error("Error fetching astrologers", error);
      }
    };
    fetchAstrologers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://book-pandit-mmed.vercel.app/api/consult/book", formData);
      setMessage("Consultation booked successfully!");
      setFormData({ name: "", email: "", dateOfBirth: "", query: "" });
    } catch (error) {
      setMessage("Failed to book consultation. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white py-5 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-extrabold">Astrology Consultation</h1>
        <nav className="flex gap-6 text-lg">
          <a href="/" className="hover:text-gray-300">Home</a>
          <a href="/services" className="hover:text-gray-300">Services</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
        </nav>
      </header>

      
      <section className="py-12 px-8">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">🔮 Meet Our Expert Astrologers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {astrologers.map((astro,index) => (
            
            <motion.div key={astro.id || index} className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-105 transition duration-300">
                <img
              src="https://www.creativehatti.com/wp-content/uploads/edd/2022/11/Indian-pandit-is-sitting-with-greet-hand-2-large.jpg "
              alt="Pandit"
              className="w-22 h-22 object-cover rounded-full border-4 border-gray-200 mb-4 mx-auto"
            />
              <h4 className="text-lg font-semibold text-gray-800">{astro.fullname}</h4>
                <p className="text-gray-600">Age: {astro.age}</p>
              <p className="text-gray-600">Expertise: {astro.expertise}</p>
              <p className="text-gray-600">Experience: {astro.experience}</p>
              <p className="text-gray-600">Contact: {astro.mobile}</p>
                <p className="text-gray-600">An experienced and knowledgeable astrologer in "{astro.expertise}" ready to guide you in your spiritual journey</p>
              <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600" onClick={() => alert(`Chat with ${astro.fullname} coming soon!`)}>Chat with Pandit</button>
            </motion.div>
          ))}
        </div>
      </section>

     
      
    </div>
  );
};

export default AstrologyConsultPage;
