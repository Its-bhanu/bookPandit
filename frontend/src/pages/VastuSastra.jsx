import React from "react";
import Header from "../components/Header";

const VastuSastra = () => {
  return (
    <div><Header />
    <div className="screen-full bg-gray-100 p-6">
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Vastu Sastra</h1>
        
        <p className="text-gray-700 text-lg mb-4">
          Vastu Shastra is an ancient Indian science of architecture and design that
          integrates the laws of nature to create harmonious living and working
          spaces. It is believed to bring prosperity, health, and happiness to the
          occupants.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6">Key Principles of Vastu</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Direction of the main entrance affects energy flow.</li>
          <li>Rooms should be designed based on the five elements (earth, water, fire, air, space).</li>
          <li>Placement of furniture and objects affects positivity and prosperity.</li>
          <li>Use of natural light and ventilation enhances well-being.</li>
          <li>Balancing the five elements promotes harmony and health.</li>
          <li>Avoid clutter to ensure smooth energy flow.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6">Best Directions for Rooms</h2>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Room</th>
              <th className="border border-gray-300 p-2">Best Direction</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Entrance</td>
              <td className="border border-gray-300 p-2">North/East</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Master Bedroom</td>
              <td className="border border-gray-300 p-2">Southwest</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Kitchen</td>
              <td className="border border-gray-300 p-2">Southeast</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Living Room</td>
              <td className="border border-gray-300 p-2">North/Northeast</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Bathroom</td>
              <td className="border border-gray-300 p-2">Northwest</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Pooja Room</td>
              <td className="border border-gray-300 p-2">Northeast</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Study Room</td>
              <td className="border border-gray-300 p-2">East/North</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6">Vastu Tips for a Positive Home</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Keep the main entrance clean and well-lit.</li>
          <li>Avoid placing mirrors in the bedroom.</li>
          <li>Place a water fountain in the northeast for prosperity.</li>
          <li>Use natural colors like white, yellow, and green for walls.</li>
          <li>Ensure that the center of the house is open and clutter-free.</li>
          <li>Position the bed with the head facing south for better sleep.</li>
          <li>Avoid building staircases in the center of the house.</li>
          <li>Avoid building staircases in the center of the house as it can disrupt energy flow.</li>
          <li>Keep indoor plants like Tulsi, Money Plant, and Bamboo to purify the air and enhance positivity.</li>
          <li>Perform regular Vastu Pooja or rituals to maintain harmony in the home.</li>
        </ul>
      </div>
      <button
           
            className="w-55 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition duration-300 ml-50 mt-8"
          ><a href="https://krish1973.wordpress.com/wp-content/uploads/2013/06/vastu-shastra.pdf">
            Download Vastu Sastra PDF
            </a>
          </button>
    </div></div>
  );
};

export default VastuSastra;
