import Signup from "../../pages/user/Signup";
import { Route, Routes, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";
import UserOtp from "../../pages/user/UserOtp";
import UserHomePage from "../../pages/user/UserHomePage";
import Login from "../../pages/user/Login";
import LandingPage from "../../pages/user/LandingPage";
// import Home from "../../pages/user/Home";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/signup" element={<Signup />} /> */}
      {/* <Route path="/otp-verification" element={<UserOtp />} /> */}
      {/* <Route path='/login' element={<Login />} /> */}
      <Route path='/home' element={<UserHomePage />} />
    </Routes>
  );
};

export default UserRoutes;
