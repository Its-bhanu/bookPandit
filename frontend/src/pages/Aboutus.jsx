import React from "react";
import Header from "../components/Header";
const AboutUs = () => {
  return (
    
    <div className><Header/>
    <div className="max-w-4xl mx-auto p-8 text-center mt-12 bg-white shadow-lg rounded-lg">
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About Us</h1>
      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Welcome to <span className="text-blue-600 font-semibold">Online Pandit</span>, your trusted platform for booking experienced
        pandits for religious ceremonies. We aim to make spiritual services
        easily accessible with seamless online bookings.
      </p>
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our mission is to bridge the gap between devotees and knowledgeable
          pandits, ensuring hassle-free and authentic religious experiences.
        </p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg mt-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
        <ul className="list-none text-gray-700 text-lg space-y-2">
          <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> Verified and experienced pandits</li>
          <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> Easy online booking and secure payments</li>
          <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> Wide range of religious services</li>
          <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> Transparent pricing and hassle-free experience</li>
        </ul>
      </div>
      <div className="bg-gray-100 p-6 rounded-lg mt-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-lg text-gray-700">
          Have questions? Reach out to us at
          <span className="text-blue-600 font-medium"> support@panditbook.com</span>
        </p>
      </div>
    </div>
    </div>
  );
};

export default AboutUs;
