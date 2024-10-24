import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import Signup from "../../pages/user/Signup";
import OtpPage from "../../pages/user/OtpPage";
import Login from "../../pages/user/Login";
import Home from "../../pages/user/Home";
import LandingPage from "../../pages/user/LandingPage";
import ForgetPassword from "../../pages/user/ForgetPassword";
import ResetPassword from "../../pages/user/ResetPassword";
import UserPrivateRoutes from "./UserPrivateRoutes"; // Protected routes handler
import UserProfile from "../../pages/user/userProfile";
import { useDispatch } from "react-redux";
import { setupInterceptors } from "../../services/axiosInstanceUser";
import { logoutUser } from "../../features/auth/authSlice";
import { toast } from "sonner";
import Services from "../../pages/user/Services";
import ServiceDetailPage from "../../pages/user/ServiceDetailPage";
import CartPage from "../../pages/user/Cart";
import CheckoutPage from "../../pages/user/CheckoutPage";
import AppointmentSuccess from "../../pages/user/AppointmentSuccess";

const UserRoutes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setupInterceptors(navigate, dispatch, logoutUser, toast); 
  }, [navigate, dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp-verification" element={<OtpPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Private (Protected) Routes */}
      <Route element={<UserPrivateRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/service" element={<Services />} />
        <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<AppointmentSuccess />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
