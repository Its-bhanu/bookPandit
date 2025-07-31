import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        
        
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">🕉️ OnlinePandit</h2>
          <p className="text-sm text-gray-400">Bringing divine rituals to your doorstep.</p>
        </div>

       
        <div className="flex flex-wrap justify-center space-x-6 text-gray-300 text-sm pt-4">
          <a href="/" className="hover:text-gray-400">Home</a>
          <a href="/aboutus" className="hover:text-gray-400">About Us</a>
          <a href="/" className="hover:text-gray-400">Services</a>
          <Link to={"/contactUs"} className="hover:text-gray-400">Contact us</Link>
          <a href="#" className="hover:text-gray-400">FAQs</a>
          <a href="#" className="hover:text-gray-400">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400">Terms of Service</a>
        </div>

       
        <div className="flex space-x-4 mt-4 md:mt-0">
          
          
          <a href="https://github.com/Its-bhanu/" className="text-gray-300 hover:text-gray-400 text-xl">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/bhanu-sharma-9b9139261/" className="text-gray-300 hover:text-green-400 text-xl">
          <FaLinkedin />
          </a>
        </div>
      </div>

      
      <div className="text-center text-gray-500 text-sm mt-6">
        &copy; {new Date().getFullYear()} OnlinePandit. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
