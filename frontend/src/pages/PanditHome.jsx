import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const PanditHomePage = () => {
  const [users, setUsers] = useState([]); // Changed "" to []
  const token=localStorage.getItem('panditsignintoken');
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://book-pandit-mmed.vercel.app//api/pandits/user/token?token=${token}`);
        // console.log("data", response.data.data[0]);
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching pandit profiles", error);
      }
    };

    fetchUsers(); 
  }, [token]); 
  useEffect(() => {

    console.log("users", users);
  }, [users])
  const handleDeleteBooking = async (bookingid) => {
  try{
    const response=await axios.delete(`https://book-pandit-mmed.vercel.app//api/pandits/poojaBooks/${bookingid}`);
    setUsers(users.filter((user)=>user._id!==bookingid));
    alert("Booking deleted successfully");

  }
  catch(error){
    console.error("Error deleting booking", error);
    alert("Failed to delete booking.");
  }
  };
  // const handleAcceptBooking = async (bookingid) => {
  //   try {
  //     const token=localStorage.getItem('panditsignintoken');

  //     const response=await axios.post(`https://book-pandit-mmed.vercel.app//api/pandits/poojaBooks/accept/${bookingid}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, 
  //         },
  //       }
  //     );
  //     alert("Booking accepted successfully");
  //   } catch (error) {
  //     console.error("Error accepting booking", error);
  //     alert("Failed to accept booking.");
  //   }
  // };

  // const handleDeclineBooking = async (bookingid) => {
  //   try {
  //     await axios.post(`https://book-pandit-mmed.vercel.app//api/pandits/poojaBooks/decline/${bookingid}`);
  //     setUsers(users.filter((user) => user._id !== bookingid));
  //     alert("Booking declined successfully");
  //   } catch (error) {
  //     console.error("Error declining booking", error);
  //     alert("Failed to decline booking.");
  //   }
  // };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-5 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-extrabold">Pandit Ji Dashboard</h1>
        <nav className="flex gap-6 text-lg">
          <a href="/services" className="hover:text-gray-300">My Services</a>
          <a href="/bookings" className="hover:text-gray-300">Bookings</a>
          {/* <a href="/profile" className="hover:text-gray-300">Profile</a> */}
          <a href="#"  onClick ={()=>{
            localStorage.removeItem('panditsignintoken');
            window.location.href='/PanditSignIn';
          }}
          className="hover:text-gray-300">Logout</a>
        </nav>
      </header>

      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center py-16"
      >
        <h2 className="text-5xl font-extrabold text-gray-800">
          Welcome, Pandit Ji! 🙏
        </h2>
        <p className="text-xl text-gray-600 mt-4">
          Manage your bookings, showcase your expertise, and connect with devotees effortlessly.
        </p>
      </motion.section>

      <section className="py-12 px-8">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">📅 Upcoming Bookings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.length > 0 ? (
            users.map((user, index) => (
              <motion.div
                key={user._id || index} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-105 transition duration-300"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {user.poojaType}
                </h4>
                <p className="text-gray-600">Name: {user.name}</p>
                <p className="text-gray-600">Date: {user.date}</p>
                <p className="text-gray-600">Location: {user.address}</p>
                <p className="text-gray-600">Time: {user.time}</p>
                <p className="text-gray-600">phoneNo: {user.phoneNo}</p>
                
                
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleDeleteBooking(user._id)}
                >
                  Delete Booking
                </button>
                {/* <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={() => handleAcceptBooking(user._id)}>Accept</button>
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-2" onClick={() => handleDeclineBooking(user._id)}>Decline</button> */}
               
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No bookings available.</p>
          )}
        </div>
      </section>

     
      <section className="py-12 px-8 bg-white">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">🛕 Services Offered</h3>
        <div className="flex flex-wrap justify-center gap-8">
          {["Vastu Shastra", "Wedding Ceremonies", "Festival Pujas"].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-100 shadow-md rounded-lg p-6 w-72 hover:shadow-xl transition duration-300"
            >
              <h4 className="text-xl font-semibold text-gray-800">{service}</h4>
              <p className="text-gray-600 mt-2">
                Expert guidance and rituals for a fulfilling experience.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="py-16 px-8 bg-gray-200">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">💬 Testimonials</h3>
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {[
            { name: "Harsit", review: "Pandit Ji made our housewarming ceremony unforgettable!" },
            { name: "Harshal", review: "Highly professional and punctual. Highly recommended!" },
            { name: "Somin.", review: "The best experience with Pandit Ji for my wedding!" },
            { name: "Nikhil.", review: "On-time service with excellent rituals performed!" },
          ].map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-md rounded-lg p-6 text-center mx-4"
              >
                <p className="text-gray-600">"{testimonial.review}"</p>
                <p className="mt-4 font-semibold">- {testimonial.name}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

     
      <section className="py-12 px-8 text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">📞 Contact Us</h3>
        <p className="text-gray-600">
          Need help? Call us at{" "}
          <span className="font-bold text-blue-600">+91 8854072557</span>
        </p>
        <p className="text-gray-600">
          Email us at{" "}
          <span className="font-bold text-blue-600">
            support@panditbooking.com
          </span>
        </p>
      </section>
    </div>
  );
};

export default PanditHomePage;

