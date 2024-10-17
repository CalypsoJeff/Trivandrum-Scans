import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  checkAuth,
  clearUser,
  selectUser,
} from "../../features/auth/authSlice";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import logo from "/Images/Logo.png";
import { FiLogOut } from "react-icons/fi";
import { toast } from "sonner";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const timeoutRef = useRef(null);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
    toast.success("User Logout Successful");
  };
  const handleSignup = () => {
    navigate("/signup");
  };
  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(menu);
  };
  const handleAuth = () => {
    dispatch(checkAuth());
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(null);
    }, 200);
  };
  return (
    <header className="flex justify-between items-center p-4 shadow-lg bg-white select-none">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-16 w-auto" />
      </div>

      {/* Navigation Links */}
      <nav className="flex space-x-8 text-gray-700">
        <button
          className="hover:text-teal-500 transition relative"
          onClick={() => navigate("/home")}
        >
          Home
        </button>
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter("trivandrumScans")}
          onMouseLeave={handleMouseLeave}
        >
          <button className="hover:text-teal-500 transition">
            Trivandrum Scans For You
          </button>
          {isDropdownOpen === "trivandrumScans" && (
            <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg">
              <div className="h-1 bg-teal-500 rounded-t-md"></div>
              <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full">
                About Us
              </button>
              <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full">
                Our Mission
              </button>
              <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full">
                Panel of Doctors
              </button>
              <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full rounded-b-md">
                Corporate Enquiry
              </button>
            </div>
          )}
        </div>

        <button
          className="hover:text-teal-500 transition relative"
          onClick={() => navigate("/service")}
        >
          Health Packages
        </button>
        <button className="hover:text-teal-500 transition relative">
          Gallery
        </button>
        <button className="hover:text-teal-500 transition relative">
          Contact Us
        </button>
      </nav>

      <div className="flex items-center space-x-4">
        {/* If the user is logged in, display user icon and name */}
        {user ? (
          <div className="flex items-center space-x-3 mr-5">
            {user?.picture ? (
              <img
                src={user.picture}
                alt="User profile"
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <Link to="/profile">
                <FaUser
                  size={18}
                  onClick={handleAuth}
                  className="text-gray-700 cursor-pointer"
                />
              </Link>
            )}
            <span className="text-gray-700 font-medium">
              {user?.name || user?.user?.name || "Guest"}
            </span>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "black",
              }}
              onClick={handleLogout}
            >
              <FiLogOut size={18} />
            </button>
          </div>
        ) : (
          // Show login and signup buttons if user is not logged in
          <>
            <button
              className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition"
              onClick={handleSignup}
            >
              Sign Up
            </button>
          </>
        )}

        {/* Cart Icon */}
        <div className="relative">
          <FaShoppingCart
            size={22}
            className="text-gray-700 cursor-pointer"
            onClick={() => navigate("/cart")}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
