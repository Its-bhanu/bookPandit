import React from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import Header from "../components/Header";

const VastuSastra = () => {
  const vastuTips = [
    "Keep the main entrance well-lit for positive energy.",
    "Never keep mirrors facing the bed.",
    "Use light colors in the prayer room for peace.",
    "Kitchen should be in the southeast corner.",
  ];

  const roomPositions = [
    { room: "Bedroom 🛏️", tip: "Southwest direction is ideal for the master bedroom." },
    { room: "Kitchen 🍳", tip: "Southeast is best for kitchens, avoid north-east." },
    { room: "Living Room 🛋️", tip: "North or east-facing living rooms bring prosperity." },
    { room: "Study Room 📚", tip: "East or north is best for concentration & learning." },
    { room: "Bathroom 🚿", tip: "North-west is ideal, avoid southwest for bathrooms." },
    { room: "Pooja Room 🕉️", tip: "North-east is considered the most sacred corner." },
  ];

  const copyTip = (tip) => {
    navigator.clipboard.writeText(tip);
    toast.success("✅ Vastu Tip Copied!");
  };

  return (
    <div>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-8">
        {/* Title */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-extrabold text-yellow-700 text-center mb-10 drop-shadow-md"
        >
          🏛️ Vastu Shastra
        </motion.h1>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl mx-auto text-lg text-gray-700 text-center leading-relaxed"
        >
          Vastu Shastra is the ancient Indian science of architecture and design. 
          It aligns homes and workplaces with nature’s forces to bring harmony, health, and prosperity 🌱.
        </motion.p>

        {/* Key Principles as Animated Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10"
        >
          {[
            "Main entrance direction affects energy.",
            "Balance of 5 elements ensures harmony.",
            "Proper ventilation & sunlight boost health.",
            "Placement of objects impacts prosperity.",
            "Clutter-free spaces attract positivity.",
            "Sacred spaces must be serene.",
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-2xl shadow-xl border border-yellow-200 hover:shadow-2xl cursor-pointer"
              onClick={() => copyTip(item)}
            >
              <h3 className="text-lg font-semibold text-yellow-700">✨ Principle {index + 1}</h3>
              <p className="text-gray-600 mt-2">{item}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* NEW Room Positioning Guide */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-yellow-800 text-center">🏠 Room Positioning Guide</h2>
          <p className="text-gray-600 text-center mt-2">Follow these Vastu placements for each room in your home</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
            {roomPositions.map((room, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-md border border-yellow-200 cursor-pointer"
                onClick={() => copyTip(`${room.room}: ${room.tip}`)}
              >
                <h3 className="text-xl font-bold text-yellow-700">{room.room}</h3>
                <p className="text-gray-600 mt-2">{room.tip}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vastu Tips Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-yellow-800 text-center">📜 Quick Vastu Tips</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {vastuTips.map((tip, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl shadow-md hover:bg-yellow-600"
                onClick={() => copyTip(tip)}
              >
                {tip}
              </motion.button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-yellow-800 text-center">❓ FAQs</h2>
          <div className="mt-6 space-y-4">
            {[
              { q: "Is Vastu Shastra scientific?", a: "Yes, it is based on natural elements, directions, and energy flow." },
              { q: "Does it apply to modern flats?", a: "Yes, with slight modifications, it can be applied to apartments." },
              { q: "Can Vastu improve financial health?", a: "It helps create balance that often reflects in prosperity." },
            ].map((faq, i) => (
              <motion.details
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white rounded-lg shadow-md cursor-pointer"
              >
                <summary className="font-semibold text-yellow-700">{faq.q}</summary>
                <p className="text-gray-600 mt-2">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>

        {/* Call To Action */}
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800">📞 Need Personalized Vastu Advice?</h2>
          <p className="text-gray-600 mt-2">Connect with expert Pandits & Astrologers now.</p>
          <button
            onClick={() => toast.success("🚀 Consultation feature coming soon!")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
          ><a href="/AstroConsult">
            Consult an Expert
            </a>
          </button>
        </motion.div> */}
      </div>
    </div>
  );
};

export default VastuSastra;
