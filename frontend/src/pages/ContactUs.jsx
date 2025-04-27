import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formEndpoint = "https://api.web3forms.com/submit"; 
    const accessKey = "76061366-af7f-4241-8ee3-99328378768e"; 
    
    const payload = {
      access_key: accessKey,
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert("Your message has been sent successfully!");
        console.log("Form data submitted:", formData);
        setFormData({ name: "", email: "", message: "" }); // Reset the form
        // navigate("/feedback"); // optional navigation
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl transition-transform transform hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-10 drop-shadow-sm">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              rows="5"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3  transition-transform duration-300 transform bg-purple-700 text-white font-semibold rounded-2xl hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
          >
            Send Message 
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
