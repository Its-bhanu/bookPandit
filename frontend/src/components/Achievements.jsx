import React from "react";
import { FaFire, FaUserTie, FaCog, FaSmile } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

const Achievements = () => {
  const achievementsData = [
    {
      icon: <FaFire className="text-red-500 animate-bounce" />,
      value: ["10+"],
      label: "Puja Performed",
    },
    {
      icon: <FaUserTie className="text-yellow-600 animate-bounce" />,
      value: ["20+"],
      label: "Pandit ji Listed",
    },
    {
      icon: <FaCog className="text-blue-600 animate-bounce" />,
      value: ["20+"],
      label: "Type of Puja",
    },
    {
      icon: <FaSmile className="text-green-500 animate-bounce" />,
      value: ["95%"],
      label: "Satisfied Customers",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-14">
          <span className="text-pink-600">ONLINEAPANDIT - </span>
          <span className="text-gray-800">
            <Typewriter
              words={["ACHIEVEMENTS", "DEVOTION", "TRUST", "FAITH"]}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {achievementsData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 transition-transform transform hover:-translate-y-2 flex flex-col items-center"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-3xl font-bold text-gray-800 h-10">
                <Typewriter
                  words={item.value}
                  loop
                  cursor
                  cursorStyle=""
                  typeSpeed={100}
                  deleteSpeed={80}
                  delaySpeed={3000}
                />
              </h3>
              {/* <h3 className="text-3xl font-bold text-gray-800">{item.value}</h3> */}
              <p className="text-gray-600 mt-2 text-lg">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
