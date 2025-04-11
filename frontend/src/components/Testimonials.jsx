import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import React from "react";
import "swiper/css/pagination";

const Testimonials = () => {
  return (
    <section className="py-16 px-8 bg-gradient-to-r from-blue-50 to-yellow-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 drop-shadow-lg">
        ⭐ What Our Users Say ⭐
      </h2>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="max-w-6xl mx-auto"
      >
        {[
          { text: "Great experience! The Pandit arrived on time and performed the puja very well.", author: "🙏 Harshit." },
          { text: "A seamless platform for Pandits to connect with devotees.", author: "🕉️ Pandit Sharma" },
          { text: "I booked a Pandit for Griha Pravesh, and the whole process was so smooth!", author: "🏡 Nikhil." },
          { text: "Highly professional service! The rituals were performed with great devotion.", author: "📿 Somin." },
          { text: "The Pandit was well-versed in all the Vedic rituals and explained everything clearly.", author: "📖 Harshal." },
          { text: "I would definitely recommend this service to everyone looking for a reliable Pandit!", author: "✨ Kartik." },
        ].map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white p-6 shadow-2xl rounded-2xl transition-all transform hover:scale-105 text-center 
                bg-opacity-80 backdrop-blur-lg border border-gray-200">
              <p className="text-gray-700 text-lg italic">"{testimonial.text}"</p>
              <p className="font-semibold mt-4 text-indigo-600 text-xl">{testimonial.author}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
