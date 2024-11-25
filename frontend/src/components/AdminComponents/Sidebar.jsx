/* eslint-disable react/prop-types */
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserFriends, FaServicestack } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { AiFillDashboard, AiOutlineProfile } from "react-icons/ai";
import { MdCategory, MdBusiness, MdChat } from "react-icons/md";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import Cookies from "js-cookie";
import { clearAdmin } from "../../features/admin/adminslice";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const adminLogout = () => {
    clearAdmin();
    Cookies.remove("admintoken");
    Cookies.remove("adminRefreshtokenx");
    navigate("/admin/login");
  };

  const menuItems = [
    { icon: AiFillDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FaUserFriends, label: "All Users", path: "/admin/userlist" },
    { icon: MdBusiness, label: "Departments", path: "/admin/departments" },
    { icon: MdCategory, label: "Categories", path: "/admin/category" },
    { icon: FaServicestack, label: "Services", path: "/admin/service" },
    { icon: BsFillCalendarCheckFill, label: "Bookings", path: "/admin/bookings" },
    { icon: AiOutlineProfile, label: "Report Management", path: "/admin/reportList" },
    { icon: MdChat, label: "Enquiries", path: "/admin/adminChat" },
  ];

  return (
    <div
      className={`w-64 bg-white shadow-lg min-h-screen fixed lg:relative transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <button onClick={toggleSidebar} className="text-gray-500 lg:hidden">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition-colors ${
              location.pathname === item.path ? "bg-gray-100 text-blue-500" : ""
            }`}
            to={item.path}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={adminLogout}
          className="flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition-colors"
        >
          <BiLogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;