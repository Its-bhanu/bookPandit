'use client';
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I use the Pooja booking service?',
      answer: (
        <ol className="list-decimal pl-6 space-y-1">
          <li>Click the "Book A Pooja" button.</li>
          <li>You will be redirected to the login/signup page.</li>
          <li>If you are a new user, register with your email and phone number.</li>
          <li>Existing users can log in using their credentials.</li>
          <li>Select the pooja service you wish to book.</li>
          <li>Choose your preferred date and time.</li>
          <li>Make a secure payment via our gateway.</li>
          <li>You'll be redirected to a feedback page after booking.</li>
          <li>The pandit will receive an email about the booking and contact you for confirmation.</li>
          <li>If the pandit is unavailable, you'll be notified and refunded within 24 hours.</li>
        </ol>
      ),
    },
    {
      question: 'How can I register as a Pandit?',
      answer:
        'To register as a Pandit, click on the "pandit Login" button on the homepage and also provide on the navbar name as "pandit Register". Fill out the form with your name, contact info, and area of expertise. Our team will review your submission and get back to you.',
    },
    {
      question: 'Is online astrology consultation available?',
      answer:
        'Currently, online astrology consultation is not available. However, we are working on it and will launch the feature soon.',
    },
    {
      question: 'How do I use AI Astrology Services?',
      answer: (
        <ol className="list-decimal pl-6 space-y-1">
          <li>Click the "Get AI Astrology Prediction" button on the homepage.</li>
          <li>Enter your birth details: date, time, and place.</li>
          <li>Submit the form to receive your personalized astrology report.</li>
          <li>The report is generated using Perplexity AI.</li>
        </ol>
      ),
    },
    {
      question: 'How can Pandits access their dedicated accounts?',
      answer:
        'Pandits can click the "Pandit Login" button on the homepage. If not registered, they should click "Register as Pandit" and complete the form. After logging in, they can access their dashboard to view or manage bookings and mark services as completed.',
    },
  ];

  const toggleIndex = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">
          How to Use These Services
        </h2>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg mb-4 overflow-hidden"
          >
            <button
              onClick={() => toggleIndex(index)}
              className="flex justify-between items-center w-full p-5 text-left font-medium text-blue-800 hover:bg-blue-100 transition-colors"
            >
              <span>{faq.question}</span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  activeIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {activeIndex === index && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-5 text-gray-700"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
