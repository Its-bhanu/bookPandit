import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "../components/Header";
import Achievements from "../components/Achievements";
import Testimonials from "../components/Testimonials";

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.scrollToService) {
      document.getElementById("services").scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="bg-gray-50 relative font-sans antialiased">
      <Header />

      {/* Hero Section */}
      <section className="relative text-center py-24 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-yellow-400 filter blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-green-400 filter blur-xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-left">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-6"
              >
                Authentic Vedic Services <span className="text-yellow-600">Online</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-xl text-gray-600 mb-8 max-w-xl"
              >
                India's most trusted platform connecting you with verified Pandits for all your spiritual needs.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/PanditSignIn"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Pandit Login
                </Link>
                <button
                  onClick={() =>
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Explore Services
                </button>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png"
                alt="Online Pandit"
                className="w-full max-w-md mx-auto"
              />
            </motion.div>
          </div>

          {/* Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
              <div className="text-green-500 text-3xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Verified Experts</h3>
              <p className="text-gray-600">1000+ verified Pandits from across India.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
              <div className="text-blue-500 text-3xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Anywhere, Anytime</h3>
              <p className="text-gray-600">Book services across cities with real-time availability.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-yellow-500">
              <div className="text-yellow-500 text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Secure & Seamless</h3>
              <p className="text-gray-600">Encrypted platform to protect your privacy.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Traditional Rituals, <span className="text-yellow-600">Modern Convenience</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Experience authentic Vedic services with the ease of modern technology
            </p>
          </motion.div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-10 rounded-3xl shadow-inner">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Comprehensive Puja Services</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Havan, Griha Pravesh, Satyanarayan Katha</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Wedding Ceremonies & Engagement Pujas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Festival Pujas & Special Occasions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Doorstep and Virtual Puja Options</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to Begin Your Spiritual Journey?</h3>
                <p className="text-gray-600 mb-6">
                  All our Pandits are trained in Vedic rituals and speak local languages. 
                  Transparent pricing with end-to-end arrangements.
                </p>
                <a
                  href="tel:+918854072557"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition font-medium"
                >
                  <span className="mr-2">📞</span> For Instantly Booking : +91 88540 72557
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pooja Booking */}
            <motion.div
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-b-4 border-green-500"
            >
              <div className="text-green-500 text-4xl mb-4">🪔</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Pooja Booking</h3>
              <p className="text-gray-600 mb-6">
                Personalized rituals by experienced Pandits with all arrangements taken care of.
              </p>
              <Link
                to="/UserSignin"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition"
              >
                Book A Pooja
              </Link>
            </motion.div>

            {/* Astrology Consultation */}
            <motion.div
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-b-4 border-blue-500"
            >
              <div className="text-blue-500 text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Astrology Consultation</h3>
              <p className="text-gray-600 mb-6">
                Get astrological guidance for marriage, career, health & more from certified experts.
              </p>
              <Link
                to="/AstroConsult"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition"
              >
                Consult Now
              </Link>
            </motion.div>

            {/* Vastu Shastra */}
            <motion.div
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-b-4 border-purple-500"
            >
              <div className="text-purple-500 text-4xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Vastu Shastra</h3>
              <p className="text-gray-600 mb-6">
                Let positive energy flow in your space with our expert Vastu consultations.
              </p>
              <Link
                to="/vastuShastra"
                className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-medium transition"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Achievements />
      <Testimonials />

      {/* Floating WhatsApp and Phone Icons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <a
          href="https://wa.me/918854072557"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white text-2xl p-4 rounded-full shadow-xl transition-all transform hover:scale-110 flex items-center justify-center w-16 h-16"
          title="Chat on WhatsApp"
        >
          <span className="block">💬</span>
        </a>
        <a
          href="tel:+918854072557"
          className="bg-blue-500 hover:bg-blue-600 text-white text-2xl p-4 rounded-full shadow-xl transition-all transform hover:scale-110 flex items-center justify-center w-16 h-16"
          title="Call Us"
        >
          <span className="block">📞</span>
        </a>
      </div>
    </div>
  );
};

export default HomePage;