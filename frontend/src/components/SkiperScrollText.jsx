
import React from "react";
import { motion } from "framer-motion";

const SkiperScrollText = () => {
  const text = "🙏 Book Verified Pandits According To Your Satisfied loaction | 📿 Hassle-free Pooja Services | 🌟 100% Satisfaction Guaranteed | ";

  return (
    <div className="w-full overflow-hidden bg-blue-50 py-2 border-y border-yellow-50">
      <motion.div
        className="whitespace-nowrap text-lg font-semibold text-gray-800"
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "linear",
        }}
      >
        <span className="px-4">{text.repeat(2)}</span>
      </motion.div>
    </div>
  );
};

export default SkiperScrollText;
