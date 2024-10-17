
import { Navigate, Outlet } from "react-router";
import React from "react";
import Cookies from "js-cookie";

const AdminPrivateRoutes = () => {
    const adminToken = Cookies.get('admintoken');
    console.log("Admin Token:", adminToken);

    return (
        adminToken ? <Outlet /> : <Navigate to={'/admin/login'} />
    );
}

export default AdminPrivateRoutes;
