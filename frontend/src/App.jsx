import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import ContactUs from "./pages/ContactUs";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UserSignUp from "./pages/UserSignUp";
import UserSignin from "./pages/UserSignin";
import Signin from "./pages/Signin";
import PoojaBooks from "./pages/poojaBooks";
import PanditProfile from "./pages/PanditProfile";
import VastuSastra from "./pages/VastuSastra";
import ForgetPassword from "./pages/ForgetPassword";
import PanditHomePage from "./pages/PanditHome";
import ThankYouPage from "./pages/Thanks"
import AboutUs from "./pages/Aboutus";
import Forgetpasspandit from './pages/Forgetpasspandit';
import AstroConsult from './pages/AstroConsult';
import AiAstrologyForm from "./pages/aiAstrology";
import ChatBox from "./pages/ChatPage";
import PanditBookingGraph from "./components/BookingGraph"
function App() {
  return (
    <BrowserRouter>
      <div>
      
       <Routes>
        <Route path="" element={<Home />} />
        <Route path="/PanditSignIn" element={<Signin/>} />
        <Route path="/UserSignIn" element={<UserSignin />} />
        <Route path="/PanditSignup" element={<Signup />} />
        <Route path="/UserSignUp" element={<UserSignUp />} />
        <Route path="/poojaBooks" element={<PoojaBooks/>} />
        <Route path="/panditProfile" element={<PanditProfile />} />
        <Route path="/vastuShastra" element={<VastuSastra />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path='/feedback' element={<ThankYouPage/>}/>
        <Route path='/pandit/forgetpassword' element={<Forgetpasspandit/>}/>
        <Route path='/aboutus' element={<AboutUs/>}/>
        <Route path='/AstroConsult' element={<AstroConsult/>}/>
        <Route path="/panditChat/:roomId" element={<ChatBox />} />
        <Route path="/aiAstrology" element={<AiAstrologyForm />} />
       </Routes>
      
   
      </div>
      <div>
      <Routes>
        <Route path="panditHome" element={<PanditHomePage />} />
      </Routes>
      </div>
    <Footer/>
    </BrowserRouter>
    
  );
}
export default App;