import React, { useEffect, useState } from "react";
import { FaUserCircle, FaTrash, FaHeart, FaPhoneAlt } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { MdEventAvailable } from "react-icons/md";
import Header from "../../components/UserComponents/Header";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { removeFromCart } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(null); // Initialize cart as null
  const user = useSelector(selectUser); // Get user data from redux
  const dispatch = useDispatch(); // To dispatch the remove action
  const navigate = useNavigate();
  const handleProceed = () => {
    navigate("/checkout");
  };

  // Fetch cart data
  const fetchCartData = async (userId) => {
    try {
      const response = await axiosInstanceUser.get(`/cart/${userId}`);
      console.log(response.data, "cart Data");
      setCart(response.data); // Store the fetched cart data
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  };

  // Handle removing a service from the cart
  const handleRemove = async (serviceId) => {
    try {
      await dispatch(removeFromCart({ userId: user.id, serviceId }));
      setCart((prevCart) => ({
        ...prevCart,
        services: prevCart.services.filter(
          (service) => service.serviceId._id !== serviceId
        ),
      }));
    } catch (error) {
      console.error("Failed to remove service from cart:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchCartData(user.id); // Fetch cart data when user ID is available
    }
  }, [user]);

  if (!cart) {
    // Handle loading or empty state
    return <div>Loading cart...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        {/* Step Tracker */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center">
                1
              </div>
              <span className="ml-2 text-teal-500 font-semibold">Step</span>
            </div>
            <div className="w-16 h-[2px] bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-400 rounded-full flex items-center justify-center">
                2
              </div>
              <span className="ml-2 text-gray-400">Step</span>
            </div>
            <div className="w-16 h-[2px] bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-400 rounded-full flex items-center justify-center">
                3
              </div>
              <span className="ml-2 text-gray-400">Step</span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Test Booking For
          </h2>
          <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg">
            <FaUserCircle className="w-10 h-10 text-blue-500" />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">Self</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1 text-gray-600">
                <BsFillPersonFill />
                <span>{user.gender}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <MdEventAvailable />
                <span>{user.age}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <FaPhoneAlt />
                <span>{user.contact}</span>
              </div>
              <div className="text-teal-500">
                <FaHeart />
              </div>
            </div>
          </div>
        </div>

        {/* Tests & Packages */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Tests & Packages
          </h2>
          {cart.services && cart.services.length > 0 ? (
            cart.services.map((service) => (
              <div
                key={service._id}
                className="flex justify-between items-center border-b pb-4 mb-4"
              >
                <div className="flex-grow">
                  <h3 className="text-md font-semibold text-gray-700">
                    {service.serviceId.name}
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-red-500 text-lg font-bold mr-4">
                    ₹{service.serviceId.price}
                  </p>
                  <div className="flex items-center space-x-4">
                    <FaHeart className="text-gray-500 cursor-pointer hover:text-red-500" />
                    <FaTrash
                      className="text-gray-500 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemove(service.serviceId._id)} // Handle remove
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              <h3 className="text-xl font-semibold">Your cart is empty</h3>
              <p className="mt-2">
                Add services to your cart to see them here.
              </p>
            </div>
          )}

          {/* Proceed Button */}
          {cart.services && cart.services.length > 0 && (
            <div className="flex justify-end mt-6">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow"
                onClick={handleProceed}
              >
                Proceed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
