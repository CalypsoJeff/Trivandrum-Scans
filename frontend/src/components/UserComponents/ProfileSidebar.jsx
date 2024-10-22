import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBook, FaLock, FaHeart, FaWallet } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

function ProfileSidebar() {
  const user = useSelector(selectUser);
  return (
    <div className="w-64 bg-white shadow-xl fixed top-0 left-0 h-full select-none">
      <div className="p-6 border-b">
        {/* User Info Section */}
        <div className="flex items-center space-x-4">
          <FaUser className="text-gray-500 text-4xl" />
          <div>
            <h1 className="text-xl font-bold text-gray-700">
              {user?.name || "User Name"}
            </h1>
            <p className="text-sm text-gray-500">
              {user?.email || "email@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar Links */}
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/profile"
              className="flex items-center p-4 hover:bg-gray-200 transition"
            >
              <FaUser className="mr-3 text-[#a39f74]" />
              <span className="text-gray-800">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/booking" // Updated to correct path
              className="flex items-center p-4 hover:bg-gray-200 transition"
            >
              <FaBook className="mr-3 text-[#a39f74]" />
              <span className="text-gray-800">Booking Details</span>
            </Link>
          </li>
          <li>
            <Link
              to="/change-password"
              className="flex items-center p-4 hover:bg-gray-200 transition"
            >
              <FaLock className="mr-3 text-[#a39f74]" />
              <span className="text-gray-800">Change Password</span>
            </Link>
          </li>
          <li>
            <Link
              to="/favorites"
              className="flex items-center p-4 hover:bg-gray-200 transition"
            >
              <FaHeart className="mr-3 text-[#a39f74]" />
              <span className="text-gray-800">Favorites</span>
            </Link>
          </li>
          <li>
            <Link
              to="/wallet"
              className="flex items-center p-4 hover:bg-gray-200 transition"
            >
              <FaWallet className="mr-3 text-[#a39f74]" />
              <span className="text-gray-800">Wallet</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ProfileSidebar;
