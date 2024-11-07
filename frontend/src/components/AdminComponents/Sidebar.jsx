import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserFriends, FaServicestack } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { AiFillDashboard, AiOutlineProfile } from "react-icons/ai";
import { MdCategory, MdBusiness, MdChat } from "react-icons/md"; // Chat icon
import { BsFillCalendarCheckFill } from "react-icons/bs"; // Bookings icon
import Cookies from "js-cookie";
import { clearAdmin } from "../../features/admin/adminslice";

function Sidebar() {
  const navigate = useNavigate();

  const adminLogout = () => {
    clearAdmin();
    Cookies.remove("admintoken");
    Cookies.remove("adminRefreshtokenx");
    navigate("/admin/login");
  };

  return (
    <div
      className="w-64 min-h-screen shadow-lg"
      style={{
        background: "linear-gradient(to bottom, #2a2e35, #1a1c20)",
        color: "#fff",
      }}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        {/* Dashboard */}
        <Link
          className="flex items-center px-4 py-2 hover:bg-opacity-10 rounded-lg transition"
          to="/admin/dashboard"
        >
          <AiFillDashboard className="w-5 h-5" />
          <span className="ml-4 font-medium">Dashboard</span>
        </Link>

        {/* All Users */}
        <Link
          className="flex items-center px-4 py-2 mt-2 hover:bg-opacity-10 rounded-lg transition"
          to="/admin/userlist"
        >
          <FaUserFriends className="w-5 h-5" />
          <span className="ml-4 font-medium">All Users</span>
        </Link>

        {/* Departments */}
        <Link
          className="flex items-center px-4 py-2 mt-2 hover:bg-opacity-10 rounded-lg transition"
          to="/admin/departments"
        >
          <MdBusiness className="w-5 h-5" />
          <span className="ml-4 font-medium">Departments</span>
        </Link>

        {/* Categories */}
        <Link
          className="flex items-center px-4 py-2 mt-2 hover:bg-opacity-10 rounded-lg transition"
          to="/admin/category"
        >
          <MdCategory className="w-5 h-5" />
          <span className="ml-4 font-medium">Categories</span>
        </Link>

        {/* Services */}
        <Link
          className="flex items-center px-4 py-2 mt-2 hover:bg-opacity-10 rounded-lg transition"
          to="/admin/service"
        >
          <FaServicestack className="w-5 h-5" />
          <span className="ml-4 font-medium">Services</span>
        </Link>

        {/* Bookings */}
        <Link
          className="flex items-center px-4 py-2 mt-2 hover:bg-opacity-10 rounded-lg transition"
          to="/admin/bookings"
        >
          <BsFillCalendarCheckFill className="w-5 h-5" />
          <span className="ml-4 font-medium">Bookings</span>
        </Link>

        {/* Report Management */}
        <Link
          className="flex items-center px-4 py-2 mt-2 hover:bg-opacity-10 rounded-lg transition"
          to="/admin/reportList"
        >
          <AiOutlineProfile className="w-5 h-5" />
          <span className="ml-4 font-medium">Report Management</span>
        </Link>

        {/* Chat */}
        <Link
          className="flex items-center px-4 py-2 mt-2 hover:bg-opacity-10 rounded-lg transition"
          to="/admin/chatList"
        >
          <MdChat className="w-5 h-5" />
          <span className="ml-4 font-medium">Chat</span>
        </Link>

        {/* Logout */}
        <Link
          className="flex items-center px-4 py-2 mt-2 hover:bg-opacity-10 rounded-lg transition"
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
