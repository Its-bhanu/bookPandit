import React from "react";
import { FaFire, FaUserTie, FaCog, FaSmile } from "react-icons/fa";

const Achievements = () => {
  
  const achievementsData = [
    {
      icon: <FaFire />,
      value: "2000+",
      label: "Puja Performed",
    },
    {
      icon: <FaUserTie />,
      value: "200+",
      label: "Pandit ji Listed",
    },
    {
      icon: <FaCog />,
      value: "100+",
      label: "Type of Puja",
    },
    {
      icon: <FaSmile />,
      value: "95%",
      label: "Satisfied Customers",
    },
  ];

  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-5xl mx-auto text-center">
      
        <h2 className="text-3xl font-bold text-gray-800  mb-8">
         ONLINEAPANDIT - ⭐ ACHIEVEMENTS⭐
        </h2>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievementsData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105"
            >
             
              <div className="text-5xl text-red-500 mb-4">{item.icon}</div>
             
              <h3 className="text-2xl font-bold">{item.value}</h3>
             
              <p className="text-gray-500 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
