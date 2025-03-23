import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleScrollToService = () => {
    navigate("/", { state: { scrollToService: true } });
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 md:flex md:items-center md:justify-between bg-yellow-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/indian-pandit-is-holding-white-board-2775574-2319297.png?f=webp"
            height="50px"
            width="80px"
            alt="Online Pandit Logo"
            className="mr-2"
          />
          <span className="text-2xl font-bold text-gray-800">OnlinePandit</span>
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>
      <div>
      <ul className={`md:flex md:space-x-6 text-lg text-gray-700 ${isOpen ? "block" : "hidden"} md:block mt-4 md:mt-0`}>
        <li className="py-2 md:py-0"><Link to="/" className="block hover:text-blue-600">Home</Link></li>
        <li className="py-2 md:py-0"><a  onClick={handleScrollToService} className="block hover:text-blue-600 cursor-pointer">Services</a></li>
        <li className="py-2 md:py-0"><Link to="/PanditSignup" className="block hover:text-blue-600">Pandits Register</Link></li>
        <li className="py-2 md:py-0"><Link to="/aboutus" className="block hover:text-blue-600">About Us</Link></li>
        <li className="py-2 md:py-0"><Link to="/contactUs" className="block hover:text-blue-600">Contact Us</Link></li>
      </ul>
      </div>
    </nav>
  );
}
      
     
    


export default Header;