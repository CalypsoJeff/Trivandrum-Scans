import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaUsers, FaChartBar, FaServicestack } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import Cookies from "js-cookie";
import { clearAdmin } from "../../features/admin/adminslice";

function Sidebar() {
  const navigate = useNavigate();

  const adminLogout = () => {
    clearAdmin();
    console.log("herereeee");
    Cookies.remove("admintoken");
    Cookies.remove("adminRefreshtokenx ");
    navigate("/admin/login");
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        <Link
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          to="/admin/dashboard"
        >
          <FaChartBar className="w-5 h-5" />
          <span className="ml-4 font-medium">Dashboard</span>
        </Link>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          to="/admin/userlist"
        >
          <FaUsers className="w-5 h-5" />
          <span className="ml-4 font-medium">All Users</span>
        </Link>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          to="/admin/departments"
        >
          <FaUsers className="w-5 h-5" />
          <span className="ml-4 font-medium">Departments</span>
        </Link>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          to="/admin/category"
        >
          <FaUsers className="w-5 h-5" />
          <span className="ml-4 font-medium">Categories</span>
        </Link>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          to="/admin/service"
        >
          <FaServicestack className="w-5 h-5" />
          <span className="ml-4 font-medium">Services</span>
        </Link>
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          to="/admin/report"
        >
          <FaUser className="w-5 h-5" />
          <span className="ml-4 font-medium">Report Management</span>
        </Link>
        
        <Link
          className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          to="/admin/login"
          onClick={adminLogout}
        >
          <BiLogOut className="w-5 h-5" />
          <span className="ml-4 font-medium">Logout</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
