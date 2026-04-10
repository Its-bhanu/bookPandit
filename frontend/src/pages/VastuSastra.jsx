import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f

/* Compass Directions */
const directions = [
  { label: "North", short: "N" },
  { label: "North-East", short: "NE" },
  { label: "East", short: "E" },
  { label: "South-East", short: "SE" },
  { label: "South", short: "S" },
  { label: "South-West", short: "SW" },
  { label: "West", short: "W" },
  { label: "North-West", short: "NW" },
];

/* 🔮 EXTENDED DIRECTION-WISE VASTU DATA */
const vastuData = {
  North: {
    about:
      "North direction is ruled by Lord Kubera and is associated with wealth, career growth, and opportunities.",
    principles: [
      "North entrance enhances financial stability.",
      "Supports career, networking, and business growth.",
      "Water element strengthens this direction.",
      "Clutter blocks prosperity in north zone.",
    ],
    dos: [
      "Use blue, green, or white shades.",
      "Keep water fountain or aquarium.",
      "Ensure entrance is well-lit.",
    ],
    donts: [
      "Avoid heavy storage.",
      "Avoid toilets in north.",
    ],
    rooms: [
      { room: "Living Room 🛋️", tip: "North-facing living rooms promote prosperity." },
      { room: "Office / Study 📚", tip: "Excellent for focus, growth, and success." },
    ],
  },

  "North-East": {
    about:
      "North-East (Ishan Kon) is the most sacred zone, associated with spirituality, wisdom, and peace.",
    principles: [
      "Enhances mental clarity and spiritual growth.",
      "Best zone for meditation and prayer.",
      "Must remain light and open.",
    ],
    dos: [
      "Place mandir or meditation space.",
      "Use white, cream, or light yellow.",
      "Allow maximum sunlight.",
    ],
    donts: [
      "Avoid kitchen or bathroom.",
      "Avoid heavy furniture.",
    ],
    rooms: [
      { room: "Pooja Room 🕉️", tip: "Ideal and highly auspicious location." },
      { room: "Living Area 🛋️", tip: "Brings calmness and harmony." },
    ],
  },

  East: {
    about:
      "East direction welcomes the rising sun and represents health, vitality, and new beginnings.",
    principles: [
      "Improves physical and mental health.",
      "Supports education and growth.",
      "Morning sunlight is beneficial.",
    ],
    dos: [
      "Keep windows open in the morning.",
      "Use wooden décor and light colors.",
    ],
    donts: [
      "Avoid heavy curtains.",
      "Avoid blocked windows.",
    ],
    rooms: [
      { room: "Study Room 📚", tip: "Improves memory and learning ability." },
      { room: "Living Room 🛋️", tip: "Enhances positivity." },
    ],
  },

  "South-East": {
    about:
      "South-East (Agni Kon) represents the fire element and governs energy, digestion, and metabolism.",
    principles: [
      "Best zone for cooking activities.",
      "Boosts energy and health.",
      "Fire element must be balanced.",
    ],
    dos: [
      "Place kitchen here.",
      "Use red, orange, or copper tones.",
    ],
    donts: [
      "Avoid water elements.",
      "Avoid blue or black colors.",
    ],
    rooms: [
      { room: "Kitchen 🍳", tip: "Most suitable direction for cooking." },
      { room: "Dining Area 🍽️", tip: "Supports digestion when balanced." },
    ],
  },

  South: {
    about:
      "South direction represents strength, fame, and reputation when balanced properly.",
    principles: [
      "Provides stability and control.",
      "Needs careful Vastu balancing.",
    ],
    dos: [
      "Use earthy tones like brown or beige.",
      "Ensure proper lighting.",
    ],
    donts: [
      "Avoid main entrance here if possible.",
    ],
    rooms: [
      { room: "Bedroom 🛏️", tip: "Supports deep and restful sleep." },
      { room: "Storage 📦", tip: "Good for heavy storage." },
    ],
  },

  "South-West": {
    about:
      "South-West (Nairutya Kon) is the most powerful direction, associated with stability, leadership, and authority.",
    principles: [
      "Best for head of the family.",
      "Provides stability and long-term success.",
    ],
    dos: [
      "Place master bedroom here.",
      "Use heavy furniture.",
    ],
    donts: [
      "Avoid water tanks.",
      "Avoid toilets.",
    ],
    rooms: [
      { room: "Master Bedroom 🛏️", tip: "Best direction for stability and authority." },
      { room: "Locker / Safe 🔐", tip: "Ideal for valuables." },
    ],
  },

  West: {
    about:
      "West direction is associated with gains, satisfaction, and fulfillment of efforts.",
    principles: [
      "Brings rewards after hard work.",
      "Needs cleanliness and balance.",
    ],
    dos: [
      "Use grey or light blue shades.",
      "Keep area clutter-free.",
    ],
    donts: [
      "Avoid open drains.",
    ],
    rooms: [
      { room: "Dining Area 🍽️", tip: "Enhances satisfaction." },
      { room: "Children Room 🧒", tip: "Supports creativity." },
    ],
  },

  "North-West": {
    about:
      "North-West represents movement, air, communication, and relationships.",
    principles: [
      "Good for guest movement.",
      "Supports communication and travel.",
    ],
    dos: [
      "Ensure good ventilation.",
      "Use white or cream shades.",
    ],
    donts: [
      "Avoid heavy storage.",
    ],
    rooms: [
      { room: "Guest Room 🛌", tip: "Comfortable for visitors." },
      { room: "Bathroom 🚿", tip: "Best placement for drainage." },
    ],
  },
};

<<<<<<< HEAD
const overviewCards = [
  {
    title: "What Is Vastu Shastra?",
    text:
      "An ancient Indian science of space planning that aligns your home with natural energies for balance, comfort, and wellbeing.",
  },
  {
    title: "Why It Matters",
    text:
      "Direction, light, and airflow influence how a space feels and functions. Small adjustments can improve harmony and clarity.",
  },
  {
    title: "How We Help",
    text:
      "Personalized guidance based on layout, entrance direction, and room usage to keep your space practical and peaceful.",
  },
];

const elements = [
  { name: "Earth (Prithvi)", hint: "Stability, grounding", tone: "bg-yellow-100" },
  { name: "Water (Jal)", hint: "Flow, prosperity", tone: "bg-blue-100" },
  { name: "Fire (Agni)", hint: "Energy, transformation", tone: "bg-orange-100" },
  { name: "Air (Vayu)", hint: "Movement, communication", tone: "bg-green-100" },
  { name: "Space (Akash)", hint: "Openness, clarity", tone: "bg-gray-100" },
];

const commonIssues = [
  "Blocked natural light at the entrance",
  "Heavy storage in the North or North-East",
  "Kitchen placed in North-East",
  "Clutter in the center of the home (Brahmasthan)",
  "Mirrors reflecting the main door",
];

const quickChecklist = [
  "Keep entryway clean, bright, and welcoming",
  "Ensure cross-ventilation and fresh airflow",
  "Place water elements in North or North-East",
  "Avoid toilets in North-East",
  "Use lighter colors in East and North",
];

=======
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
const VastuSastra = () => {
  const [selectedDirection, setSelectedDirection] = useState("North");
  const data = vastuData[selectedDirection];

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 px-6 py-10">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-extrabold text-yellow-700">
            🏛️ Vastu Shastra
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Detailed Vastu guidance based on your home entrance direction 🧭
          </p>
        </motion.div>

<<<<<<< HEAD
        {/* OVERVIEW */}
        <section className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {overviewCards.map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -6 }}
                className="bg-white/80 border border-yellow-200 rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-yellow-800">{card.title}</h3>
                <p className="text-gray-700 mt-3">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

=======
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
        {/* COMPASS */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-yellow-800">
            🧭 Select Entrance Direction
          </h2>

          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mt-10">
            {directions.map((dir) => (
              <motion.button
                key={dir.label}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedDirection(dir.label)}
                className={`p-4 rounded-xl font-semibold border
                  ${
                    selectedDirection === dir.label
                      ? "bg-yellow-500 text-white shadow-lg"
                      : "bg-white text-gray-700 border-yellow-200"
                  }`}
              >
                {dir.short}
              </motion.button>
            ))}
          </div>

          <p className="mt-6 text-lg text-gray-700">
            Selected Direction:
            <span className="ml-2 font-bold text-yellow-700">
              {selectedDirection}
            </span>
          </p>
        </section>

        {/* ABOUT */}
        <section className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-yellow-800 mb-4 text-center">
            📖 About This Direction
          </h2>
          <p className="text-gray-700 text-center">{data.about}</p>
        </section>

        {/* PRINCIPLES */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-yellow-800 text-center mb-10">
            ✨ Key Principles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.principles.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white/70 backdrop-blur-xl border border-yellow-200 rounded-2xl p-6 shadow-lg"
              >
                {p}
              </motion.div>
            ))}
          </div>
        </section>

<<<<<<< HEAD
        {/* ELEMENTS */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-yellow-800 text-center mb-10">
            🧩 The Five Elements (Panchabhuta)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {elements.map((item) => (
              <div
                key={item.name}
                className={`${item.tone} rounded-2xl p-5 border border-yellow-200 shadow-sm`}
              >
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.hint}</p>
              </div>
            ))}
          </div>
        </section>

=======
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
        {/* DO & DON'T */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold text-green-700 mb-4">✅ Do's</h3>
            <ul className="space-y-2 text-gray-700">
              {data.dos.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">❌ Don'ts</h3>
            <ul className="space-y-2 text-gray-700">
              {data.donts.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ROOMS */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-yellow-800 text-center">
            🏠 Ideal Room Placement
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {data.rooms.map((room, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-gradient-to-br from-white to-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-md"
              >
                <h3 className="text-xl font-bold text-yellow-700">{room.room}</h3>
                <p className="text-gray-600 mt-3">{room.tip}</p>
              </motion.div>
            ))}
          </div>
        </section>

<<<<<<< HEAD
        {/* CHECKLIST + COMMON ISSUES */}
        <section className="mt-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white/70 border border-yellow-200 rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-yellow-800">✅ Quick Vastu Checklist</h3>
            <ul className="mt-4 space-y-2 text-gray-700">
              {quickChecklist.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white/70 border border-yellow-200 rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-yellow-800">⚠️ Common Mistakes</h3>
            <ul className="mt-4 space-y-2 text-gray-700">
              {commonIssues.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 border border-yellow-300 rounded-3xl p-8 text-center shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-900">
              Ready for a Personal Vastu Review?
            </h3>
            <p className="text-gray-700 mt-3">
              Get practical, room-by-room guidance tailored to your home layout.
            </p>
            <div className="mt-6">
              <Link
                to="/UserSignIn"
                state={{ redirectTo: "/service-choice" }}
                className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-700 transition"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </section>

=======
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
      </div>
    </div>
  );
};

export default VastuSastra;
