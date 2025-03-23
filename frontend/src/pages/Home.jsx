import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Signup from "../pages/Signup"
import Header from "../components/Header";
import Footer from "../components/Footer";
import Achievements from "../components/Achievements";
import Testimonials from "../components/Testimonials";
import { motion } from "framer-motion";

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location?.state && location.state?.scrollToService) {
      document.getElementById("services").scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
     
    <div className="bg-gray-100">
      <Header />
      <section className="text-center py-16 bg-white shadow-md">
        <div className="flex justify-center items-center">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/male-pandit-showing-mobile-2775575-2319298.png" alt="Online Pandit" className="mx-auto" 
         height="90px"
         width="150px"
         />
        </div>
        <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }} className="text-4xl font-bold text-gray-800">Welcome to OnlinePandit</motion.h1>
        < p
         
        className="text-lg text-gray-600 mt-4">
        <h3>We provide highly qualified and experienced Panditjee for all communities
        like Gujarati, Rajasthani, Marathi, Sindhi, Bihari, Bengali, and Punjabi.</h3>
          Book a verified Pandit for your religious ceremonies or register as a Pandit.
        </p>
        <div className="mt-6 justify-center flex gap-4">
            
            <Link to="/PanditSignIn" className="bg-green-500 text-white px-6 py-3 rounded-2xl hover:bg-green-700">SignIn As a Pandit</Link>
        </div>
        <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
       
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Trusted Vedic and Hindu Puja Services
        </h2>
        
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p
           
          className="text-gray-600 leading-relaxed text-lg">
            OnlinePandit is the most trusted platform for availing Vedic and Hindu Puja services like performing Vedic rituals, religious ceremonies, Vastu Yagya, and many more. We provide the best experienced and well-known purohits and pandits at your place to do puja. We are a leading Pandit booking website.
          </p>

          <p 
           className="text-gray-600 leading-relaxed text-lg mt-4">
            Now, you can perform your pooja with our professional purohits and pandits. Our pandits perform rituals like Havan, Yagya, Shanti Vidhi, Shubh Vivah – Wedding Ceremony, Satyanarayan Katha, Griha Pravesh, Namkaran Sanskar, Nava Graha Shanti, Engagement, Festival Puja, Janeu, Ganesh Puja, Ram Katha, Mundan Sanskar, Shrimant Puja, Namkaran, Bhagwat Katha, Vastu Shanti, etc.
          </p>

          

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6">
            Book Online Pandit For Any Puja at Your Place In Just One Call –{" "}
            <a href="tel:+918854072557" className="text-blue-500 hover:underline">
              +91 8854072557
            </a>
          </h3>
        </div>
      </div>
      </section>
      </section>

      
      <section className="py-16 px-8" id="services">
        <h2 className="text-3xl font-bold text-center text-gray-800">Our Services</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          <div className="bg-white p-6 shadow-md rounded-lg w-80 text-center hover:scale-105 ">
            <h3 className="text-xl font-semibold">Pooja Booking</h3>
            <p className="text-gray-600 mt-2">
              Book a Pandit for your special occasions. We provide personalized rituals with expert guidance, end-to-end puja arrangements, and more.
            </p>
            <Link to="/UserSignin" className="bg-green-400 text-white px-6 py-3 rounded-2xl hover:bg-green-700 mt-4 inline-block">Book A Pooja</Link>
            
          </div>
          <div className="bg-white p-6 shadow-md rounded-lg w-80 text-center hover:scale-105 ">
            <h3 className="text-xl font-semibold">Astrology Consultation</h3>
            <p className="text-gray-600 mt-2">
              Get expert astrology consultations for your personal and professional life. Our experienced astrologers provide accurate and insightful readings.
            </p>
            <Link to="/AstroConsult" 
              
             className="bg-blue-400 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 mt-4 inline-block" >Consult Now</Link>
          </div>
          <div className="bg-white p-6 shadow-md rounded-lg w-80 text-center hover:scale-105 ">
            <h3 className="text-xl font-semibold">Vastu Shastra</h3>
            <p className="text-gray-600 mt-2">
              Enhance the positive energy in your home or office with our Vastu Shastra services. Our experts provide comprehensive Vastu analysis and solutions.
            </p>
            <Link to="/vastuShastra" className="bg-red-400 text-white px-6 py-3 rounded-2xl hover:bg-red-700 mt-4 inline-block">Learn More</Link>
          </div>
        </div>
      </section>

      <Achievements/>
      
      <Testimonials />

         
      
    </div>
  );
};

export default HomePage;
