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
    <div className="bg-gray-100 relative font-sans">
      <Header />

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-b from-white to-gray-100 shadow-md">
        <div className="flex justify-center items-center mb-6">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png"
            alt="Online Pandit"
            className="h-36 w-auto"
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-gray-800"
        >
          Welcome to OnlinePandit
        </motion.h1>

        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          <strong >India’s trusted platform</strong> to connect you with qualified and verified
          Pandits from all communities. Book rituals, seek spiritual guidance, or offer online
          consultations — all at your fingertips.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/PanditSignIn"
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 shadow-lg"
          >
            Sign In as Pandit
          </Link>
          </div>

          <div className="mt-2 flex justify-center">
    <button
      onClick={() =>
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
      }
      className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 shadow-lg transition"
    >
      Explore Services
    </button>
  </div>

        {/* Highlights */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-md w-72">
            <h3 className="text-xl font-bold text-green-600">Verified Experts</h3>
            <p className="text-gray-600 mt-2">1000+ verified Pandits from across India.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md w-72">
            <h3 className="text-xl font-bold text-indigo-600">Anywhere, Anytime</h3>
            <p className="text-gray-600 mt-2">Book services across cities with real-time availability.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md w-72">
            <h3 className="text-xl font-bold text-yellow-600">Secure & Seamless</h3>
            <p className="text-gray-600 mt-2">Encrypted platform to protect your privacy and details.</p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
            Trusted Vedic and Hindu Puja Services
          </h2>

          <div className="bg-gray-50 p-8 rounded-3xl shadow-lg text-center">
            <p className="text-gray-600 text-lg">
              Book Pandits for all your rituals — Havan, Griha Pravesh, Satyanarayan Katha,
              Engagement, Festival Puja, Wedding Ceremony, and more. We offer doorstep services
              along with virtual puja options.
            </p>

            <p className="text-gray-600 text-lg mt-4">
              All our Pandits are trained in Vedic rituals and speak local languages. Transparent
              pricing. End-to-end arrangements. On-time service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">
              Call to book instantly –{" "}
              <a
                href="tel:+918854072557"
                className="text-blue-500 underline hover:text-blue-700"
              >
                +91 88540 72557
              </a>
            </h3>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-100">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {/* Pooja Booking */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-green-500"
          >
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Pooja Booking</h3>
            <p className="text-gray-600 mb-4">
              Personalized rituals by experienced Pandits with all arrangements taken care of.
            </p>
            <Link
              to="/UserSignin"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            >
              Book A Pooja
            </Link>
          </motion.div>

          {/* Astrology Consultation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-blue-500"
          >
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Astrology Consultation</h3>
            <p className="text-gray-600 mb-4">
              Get astrological guidance for marriage, career, health & more from certified experts.
            </p>
            <Link
              to="/AstroConsult"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Consult Now
            </Link>
          </motion.div>

          {/* Vastu Shastra */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-red-500"
          >
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Vastu Shastra</h3>
            <p className="text-gray-600 mb-4">
              Let positive energy flow in your space with our expert Vastu consultations.
            </p>
            <Link
              to="/vastuShastra"
              className="inline-block bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
            >
              Learn More
            </Link>
          </motion.div>
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
          className="bg-green-500 hover:bg-green-600 text-white text-xl p-4 rounded-full shadow-xl transition-transform transform hover:scale-110"
          title="Chat on WhatsApp"
        >
          💬
        </a>
        <a
          href="tel:+918854072557"
          className="bg-blue-500 hover:bg-blue-600 text-white text-xl p-4 rounded-full shadow-xl transition-transform transform hover:scale-110"
          title="Call Us"
        >
          📞
        </a>
      </div>
    </div>
  );
};

export default HomePage;
