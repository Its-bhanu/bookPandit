import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const AstroConsult = () => {
  const [message, setMessage] = useState("");
  const [astrologers, setAstrologers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://book-pandit-mmed.vercel.app/api/pandits/AllProfiles");
        
        console.log("Full API Response:", response);
        
        // First check if response.data exists and is an array
        if (!response.data) {
          throw new Error("No data received from API");
        }
        const dataArray = Array.isArray(response.data) ? response.data : [response.data];
        
        const filteredAstrologers = dataArray.filter((astro) => {
          if (!astro) return false;
          
    
          if (astro.expertise) {
            const expertise = astro.expertise.toString().toLowerCase();
            return expertise.includes("astrolog") || expertise.includes("astrology");
          }
          
          // If no expertise field, include them anyway (you can remove this if you want strict filtering)
          return false;
        });
        
        console.log("Filtered Astrologers:", filteredAstrologers);
        setAstrologers(filteredAstrologers);
        
        if (filteredAstrologers.length === 0) {
          setMessage("No astrologers found. Please check back later.");
        }
      } catch (error) {
        console.error("Error fetching astrologers", error);
        setMessage("Failed to load astrologers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAstrologers();
  }, []);

  const handleChatWithPandit = (panditId) => {
    navigate("/panditChat", {
      state: {
        panditId: panditId,
      },
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Loader Component
  const Loader = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Mobile Menu */}
      <header className="bg-blue-700 text-white py-5 px-6 flex justify-between items-center shadow-lg relative">
        <h1 className="text-3xl font-extrabold">Astrology Consultation</h1>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-lg">
          <a href="/" className="hover:text-gray-300">Home</a>
          <a href="/services" className="hover:text-gray-300">Services</a>
          <a href="/contactUs" className="hover:text-gray-300">Contact</a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-blue-800 md:hidden z-10 shadow-lg"
          >
            <div className="flex flex-col p-4 space-y-4">
              <a 
                href="/" 
                className="hover:text-gray-300 border-b border-blue-700 pb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/services" 
                className="hover:text-gray-300 border-b border-blue-700 pb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="/contactUs" 
                className="hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </header>

      <section className="py-12 px-4 md:px-8">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">🔮 Meet Our Expert Astrologers</h3>
        
        {isLoading ? (
          <Loader />
        ) : message ? (
          <div className="text-center text-red-500 py-10">{message}</div>
        ) : astrologers.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No astrologers available at the moment. Please check back later.
            <div className="mt-4 text-xs">Debug: API response structure might be different than expected</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {astrologers.map((astro, index) => (
              <motion.div 
                key={astro._id || index} 
                className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-105 transition duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={astro.image || astro.profileImage || "https://www.creativehatti.com/wp-content/uploads/edd/2022/11/Indian-pandit-is-sitting-with-greet-hand-2-large.jpg"}
                  alt="Astrologer"
                  className="w-22 h-22 object-cover rounded-full border-4 border-gray-200 mb-4 mx-auto"
                />
                <h4 className="text-lg font-semibold text-gray-800">
                  {astro.fullname || astro.name || astro.username || "Astrologer"}
                </h4>
                <p className="text-gray-600">Age: {astro.age || "Not specified"}</p>
                <p className="text-gray-600">Expertise: {astro.expertise || "Astrology"}</p>
                <p className="text-gray-600">Experience: {astro.experience || "Not specified"}</p>
                <p className="text-gray-600">Contact: {astro.mobile || astro.phone || "Not provided"}</p>
                <p className="text-gray-600">
                  {astro.description || `An experienced astrologer in ${astro.expertise || "Astrology"}`}
                </p>
                <button 
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={() => handleChatWithPandit(astro._id)}
                >
                  Chat Now
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AstroConsult;