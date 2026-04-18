import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);
  const [userToken, setUserToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userlogintoken");
    
    // Only set user token if it exists AND is valid
    if (token) {
      validateAndFetchBookings(token);
    } else {
      setUserToken(null);
      setBookingCount(0);
    }
  }, []);

  const validateAndFetchBookings = async (token) => {
    try {
      // Validate token by fetching bookings (this will fail if token is expired/invalid)
      const response = await axios.get(`${API_BASE}/api/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      
      // Token is valid - set it and update booking count
      setUserToken(token);
      setBookingCount(response.data?.data?.length || 0);
      
      // Refresh booking count every 30 seconds
      const interval = setInterval(() => fetchBookingCount(token), 30000);
      return () => clearInterval(interval);
    } catch (error) {
      // Token is invalid or expired - clear it
      console.log("Token validation failed, clearing authentication");
      localStorage.removeItem("userlogintoken");
      localStorage.removeItem("userId");
      setUserToken(null);
      setBookingCount(0);
    }
  };

  const fetchBookingCount = async (token) => {
    try {
      const response = await axios.get(`${API_BASE}/api/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingCount(response.data?.data?.length || 0);
    } catch (error) {
      // If fetch fails, clear the invalid token
      console.error("Error fetching booking count - clearing token:", error);
      localStorage.removeItem("userlogintoken");
      localStorage.removeItem("userId");
      setUserToken(null);
      setBookingCount(0);
    }
  };

  const handleScrollToService = () => {
    navigate("/", { state: { scrollToService: true } });
  };

  const handleLogout = () => {
    localStorage.removeItem("userlogintoken");
    localStorage.removeItem("userId");
    setUserToken(null);
    setBookingCount(0);
    navigate("/");
  };

  return (
    <nav className="bg-white-100 shadow-md py-4 px-6 md:flex md:items-center md:justify-between bg-yellow-100">
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
          <li className="py-2 md:py-0"><a onClick={handleScrollToService} className="block hover:text-blue-600 cursor-pointer">Services</a></li>
          <li className="py-2 md:py-0"><Link to="/PanditSignup" className="block hover:text-blue-600">Pandits Register</Link></li>
          <li className="py-2 md:py-0"><Link to="/aboutus" className="block hover:text-blue-600">About Us</Link></li>
          <li className="py-2 md:py-0"><Link to="/contactUs" className="block hover:text-blue-600">Contact Us</Link></li>
          
          {userToken ? (
            <>
              <li className="py-2 md:py-0">
                <Link 
                  to="/user/bookings" 
                  className="block hover:text-blue-600 font-semibold relative"
                >
                  My Bookings
                  {bookingCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute -top-3 -right-2">
                      {bookingCount}
                    </span>
                  )}
                </Link>
              </li>
              <li className="py-2 md:py-0">
                <button 
                  onClick={handleLogout}
                  className="block hover:text-red-600 font-semibold"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="py-2 md:py-0"><Link to="/UserSignIn" className="block hover:text-blue-600">User Login</Link></li>
              <li className="py-2 md:py-0"><Link to="/UserSignUp" className="block hover:text-blue-600">User Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;