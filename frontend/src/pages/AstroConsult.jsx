import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaStar, FaRegStar } from "react-icons/fa";

const AstroConsult = () => {
  const [message, setMessage] = useState("");
  const [astrologers, setAstrologers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // List of all expertise to filter
  const expertiseList = [
    "astrolog",
    "astrology",
    "Vastu Consultant",
    "Numerologist",
    "Palmist"
  ];

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://book-pandit-mmed.vercel.app/api/pandits/AllProfiles");
        const dataArray = Array.isArray(response.data) ? response.data : [response.data];
        
        // Filter based on all expertise in the list
        const filtered = dataArray.filter((astro) => {
          const astroExpertise = astro?.expertise?.toString().toLowerCase();
          return expertiseList.some(expertise => 
            astroExpertise.includes(expertise.toLowerCase())
          );
        });
        
        setAstrologers(filtered);
        if (filtered.length === 0) setMessage("No astrologers found at the moment.");
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
      state: { panditId },
    });
  };

  const filteredAstrologers = astrologers.filter(astro => {
    return astro.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           astro.expertise?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < rating ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-yellow-400" />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Astrology Consultation</h1>
      </header>

      {/* Search Section */}
      <section className="py-8 px-4 md:px-12 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Connect with Verified Astrologers
          </h2>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search astrologers..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 px-4 md:px-12 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : message ? (
          <div className="text-center py-10 text-gray-600">{message}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAstrologers.map((astro, index) => (
              <motion.div
                key={astro._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex flex-col items-center mb-4">
                    <img
                      src={astro.image || astro.profileImage || "https://www.creativehatti.com/wp-content/uploads/edd/2022/11/Indian-pandit-is-sitting-with-greet-hand-2-large.jpg"}
                      alt={astro.fullname}
                      className="w-20 h-20 rounded-full border-2 border-indigo-100 object-cover"
                    />
                    <h3 className="text-xl font-semibold mt-3 text-gray-800">{astro.fullname || "Astrologer"}</h3>
                    <p className="text-indigo-600 text-sm">{astro.expertise || "Vedic Astrologer"}</p>
                  </div>

                  <div className="flex justify-center mb-3">
                    <div className="flex">
                      {renderStars(4)}
                      <span className="ml-1 text-gray-600 text-sm">(24)</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><span className="font-medium">Experience:</span> {astro.experience || '5'} years</p>
                    <p><span className="font-medium">Languages:</span> {astro.languages || 'Hindi, English'}</p>
                    <p><span className="font-medium">Specialty:</span> {astro.expertise || 'Vedic, Horoscope, Palmistry'}</p>
                  </div>

                  <button
                    onClick={() => handleChatWithPandit(astro._id)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Chat Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AstroConsult;