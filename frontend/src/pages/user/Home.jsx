/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/UserComponents/Header";
import Footer from "../../components/UserComponents/Footer";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, clearUser } from "../../features/auth/authSlice";
import { Team } from "../../components/UserComponents/Team";
import { Features } from "../../components/UserComponents/Features";
import { toast } from "sonner";
import { addToCart } from "../../features/cart/cartSlice";
import ImageCarousel from "../../components/UserComponents/ImageCarousel";
import { fetchServices } from "../../services/userService";
import Modal from "../../components/UserComponents/Modal";

function Home() {
  const user = useSelector(selectUser);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [limit] = useState(8);
  const userId = user?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sample team data
  const teamData = [
    { name: "Jayan Varghese", job: "CEO", img: "/Images/Team/01.jpg" },
    { name: "PS Nair", job: "CTO", img: "/Images/Team/02.jpg" },
  ];

  // Sample features data
  const featuresData = [
    {
      icon: "🦴",
      title: "CT Scan",
      text: "High precision, low radiation CT scans for accurate diagnostics.",
    },
    {
      icon: "🧠",
      title: "World's Best 3T MRI",
      text: "Offering extra clarity, enhanced comfort, and in-bore movie experience.",
    },
    {
      icon: "🩺",
      title: "Ultrasound",
      text: "State-of-the-art ultrasound services with real-time imaging.",
    },
  ];

  useEffect(() => {
    const checkUserBlocked = async () => {
      if (user?.isBlocked) {
        console.log(user.isBlocked, "qqqqqqqqqqqqq");
        setIsBlocked(true);
      }
    };

    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServices(1, limit);
        setServices(data.services);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
    checkUserBlocked();
  }, [user]);

  const handleAddToCart = async (service) => {
    if (!userId) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }
    const cartData = {
      userId,
      serviceId: service._id,
    };
    try {
      await dispatch(addToCart(cartData));
      toast.success("Service added to cart!");
      navigate("/cart");
    } catch (error) {
      toast.error("Failed to add service to cart");
      console.error("Failed to add service to cart:", error);
    }
  };

  const handleModalClose = () => {
    dispatch(clearUser());
    navigate("/login");
  };
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div>
      {isBlocked && (
        <Modal
          message="Your account is temporarily blocked."
          onClose={handleModalClose}
        />
      )}
      <Header />
      <div
        className="image-carousel"
        style={{ position: "relative", zIndex: 1 }}
      >
        <ImageCarousel userName={user.name || user.user.name} />
      </div>
      <Features data={featuresData} />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Our Services
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service._id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between"
              >
                <img
                  src={service.serviceImageUrl}
                  alt={service.name}
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
                <div className="flex-grow">
                  <Link
                    to={`/service/${service._id}`}
                    className="text-xl font-bold text-gray-700 hover:underline block mb-2"
                  >
                    {service.name}
                  </Link>
                  <p className="text-gray-500">
                    Category: {service.category ? service.category.name : "N/A"}
                  </p>
                  <p className="text-blue-500 font-semibold mt-2">
                    Price: Rs {service.price}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mb-2"
                    onClick={() => handleAddToCart(service)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No services available</p>
          )}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/service")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            View All Services
          </button>
        </div>
      </div>
      <Team data={teamData} />
      <Footer />
    </div>
  );
}

export default Home;
