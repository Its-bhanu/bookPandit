import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

const Testimonials = () => {
  const testimonials = [
    {
      text: "Great experience! The Pandit arrived on time and performed the puja very well.",
      author: "🙏 Harshit.",
    },
    {
      text: "A seamless platform for Pandits to connect with devotees.",
      author: "🕉️ Pandit Sharma",
    },
    {
      text: "I booked a Pandit for Griha Pravesh, and the whole process was so smooth!",
      author: "🏡 Nikhil.",
    },
    {
      text: "Highly professional service! The rituals were performed with great devotion.",
      author: "📿 Somin.",
    },
    {
      text: "The Pandit was well-versed in all the Vedic rituals and explained everything clearly.",
      author: "📖 Harshal.",
    },
    {
      text: "I would definitely recommend this service to everyone looking for a reliable Pandit!",
      author: "✨ Kartik.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-tr from-white to-blue-50">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-14 tracking-wide">
        ⭐ What Our Users Say ⭐
      </h2>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="max-w-6xl mx-auto"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-md border border-gray-200 p-6 rounded-3xl shadow-xl text-center hover:scale-105 transform transition-all duration-300"
            >
              <p className="text-gray-700 text-[17px] leading-relaxed italic">
                "{testimonial.text}"
              </p>
              <p className="mt-4 font-semibold text-xl text-indigo-600">
                {testimonial.author}
              </p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
