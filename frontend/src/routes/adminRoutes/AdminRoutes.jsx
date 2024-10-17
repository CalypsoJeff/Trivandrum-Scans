import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../../pages/admin/AdminLogin";
import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminPrivateRoutes from "./AdminPrivateRoutes";
import UserList from "../../pages/admin/UserList";
import Departments from '..//..//pages/admin/Departments'
import Category from "../../pages/admin/Category";
import Service from "../../pages/admin/Service";
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="" element={<AdminPrivateRoutes />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path='/userlist' element={<UserList />} />
        <Route path = '/departments' element= {<Departments/>} />
        <Route path="/service" element = {<Service/>} />
        <Route path="/category" element = {<Category/>} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
