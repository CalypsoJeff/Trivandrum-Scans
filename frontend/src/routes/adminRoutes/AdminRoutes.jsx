import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../../pages/admin/AdminLogin";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminPrivateRoutes from "./AdminPrivateRoutes";
import UserList from "../../pages/admin/UserList";
import Departments from "..//..//pages/admin/Departments";
import Category from "../../pages/admin/Category";
import Service from "../../pages/admin/Service";
import BookingDetail from "../../pages/admin/BookingDetail";
import Bookings from "..//..//pages/admin/Bookings";
import AdminChat from "../../pages/admin/AdminChat";
import ChatList from "../../pages/admin/ChatList";
import ReportList from "../../pages/admin/ReportList";
import Chat from "../../pages/admin/Chat";
import AdminErrorPage from "../../pages/admin/AdminErrorPage";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="" element={<AdminPrivateRoutes />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/service" element={<Service />} />
        <Route path="/category" element={<Category />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/:bookingId" element={<BookingDetail />} />
        <Route path="/chat/:chatId" element={<AdminChat />} />
        <Route path="/chatList" element={<ChatList />} />
        <Route path="/reportList" element={<ReportList />} />
        <Route path="/adminChat" element={<Chat />} />
        <Route path="*" element={<AdminErrorPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
