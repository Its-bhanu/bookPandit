import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { FaBars, FaTimes, FaCommentDots, FaPaperPlane, FaTimesCircle } from "react-icons/fa";

const PanditHomePage = () => {
  const [users, setUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: " Here Pandit Can be Chat with user at a real Time", sender: "bot" }
  ]);
  const token = localStorage.getItem("panditsignintoken");

  useEffect(() => {
    if (!token) return; // avoid call if token missing

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          ` https://book-pandit-mmed.vercel.app/api/pandits/user/token?token=${token}`
        );
        setUsers(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching pandit profiles", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(
        ` https://book-pandit-mmed.vercel.app/api/pandits/poojaBooks/${bookingId}`
      );
      setUsers((prev) => prev.filter((user) => user._id !== bookingId));
      alert("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking", error);
      alert("Failed to delete booking.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    // Add user message
    setMessages(prev => [...prev, { text: message, sender: "user" }]);
    setMessage("");
    
    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Chat With user will be Comming Soon...", 
        sender: "bot" 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Chat Icon */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg">
          {isChatOpen ? <FaTimesCircle size={24} /> : <FaCommentDots size={24} />}
        </div>
      </motion.div>

      {/* Chat Box */}
      {isChatOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-24 right-8 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
        >
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">Chat With User</h3>
            <button onClick={toggleChat} className="text-white">
              <FaTimes />
            </button>
          </div>
          
          <div className="h-64 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}
              >
                <div 
                  className={`inline-block p-2 rounded-lg ${msg.sender === "user" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-800"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border rounded-l-lg p-2 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
            >
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-5 px-6 flex justify-between items-center shadow-lg relative">
        <h1 className="text-2xl md:text-3xl font-extrabold">Pandit Ji Dashboard</h1>
        <nav className="hidden md:flex gap-6 text-lg">
          <a href="/" className="hover:text-gray-300">My Services</a>
          <a href="" className="hover:text-gray-300">Bookings</a>
          <a
            href="#"
            onClick={() => {
              localStorage.removeItem("panditsignintoken");
              window.location.href = "/PanditSignIn";
            }}
            className="hover:text-gray-300"
          >
            Logout
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-2xl" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-purple-800 md:hidden z-10 shadow-lg"
          >
            <div className="flex flex-col p-4 space-y-4">
              {["services", "bookings"].map((item) => (
                <a
                  key={item}
                  href={`/`}
                  className="hover:text-gray-300 border-b border-purple-700 pb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
              <a
                href="#"
                className="hover:text-gray-300"
                onClick={() => {
                  setIsMenuOpen(false);
                  localStorage.removeItem("panditsignintoken");
                  window.location.href = "/PanditSignIn";
                }}
              >
                Logout
              </a>
            </div>
          </motion.div>
        )}
      </header>

      {/* Welcome */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center py-16"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Welcome, Pandit Ji! 🙏
        </h2>
        <p className="text-xl text-gray-600 mt-4">
          Manage your bookings, showcase your expertise, and connect with devotees effortlessly.
        </p>
      </motion.section>

      {/* Upcoming Bookings */}
      <section className="py-12 px-4 md:px-8">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">📅 Upcoming Bookings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.length > 0 ? (
            users.map((user, index) => (
              <motion.div
                key={user._id || index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
              >
                <h4 className="text-lg font-semibold text-gray-800">{user.poojaType}</h4>
                <p className="text-gray-600">Name: {user.name}</p>
                <p className="text-gray-600">Date: {user.date}</p>
                <p className="text-gray-600">Location: {user.address}</p>
                <p className="text-gray-600">Time: {user.time}</p>
                <p className="text-gray-600">Phone No: {user.phoneNo}</p>

                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDeleteBooking(user._id)}
                >
                  Delete Booking
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No bookings available.</p>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-12 px-4 bg-white">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">🛕 Services Offered</h3>
        <div className="flex flex-wrap justify-center gap-6">
          {["Vastu Shastra", "Wedding Ceremonies", "Festival Pujas"].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-gray-100 rounded-xl p-6 w-72 shadow hover:shadow-lg"
            >
              <h4 className="text-xl font-semibold">{service}</h4>
              <p className="text-gray-600 mt-2">Expert rituals for a fulfilling experience.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-100">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">💬 Testimonials</h3>
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full max-w-6xl mx-auto"
        >
          {[
            { name: "Harsit", review: "Pandit Ji made our housewarming ceremony unforgettable!" },
            { name: "Harshal", review: "Highly professional and punctual. Highly recommended!" },
            { name: "Somin", review: "The best experience with Pandit Ji for my wedding!" },
            { name: "Nikhil", review: "On-time service with excellent rituals performed!" },
          ].map((testimonial, i) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white shadow-md rounded-lg p-6 text-center"
              >
                <p className="text-gray-600">"{testimonial.review}"</p>
                <p className="mt-4 font-semibold">- {testimonial.name}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Contact */}
      <section className="py-12 text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">📞 Contact Us</h3>
        <p className="text-gray-600">Need help? Call us at <span className="font-semibold text-blue-600">+91 8854072557</span></p>
        <p className="text-gray-600">Email: <span className="font-semibold text-blue-600">support@panditbooking.com</span></p>
      </section>
    </div>
  );
};

export default PanditHomePage;