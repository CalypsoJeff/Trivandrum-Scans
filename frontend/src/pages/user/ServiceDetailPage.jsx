import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/UserComponents/Header";
import { AiOutlineHeart } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import ReactImageGallery from "react-image-gallery";
import { toast } from "sonner";
import "react-image-gallery/styles/css/image-gallery.css"; // Import gallery styles
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { selectUser } from "../../features/auth/authSlice";
import { fetchServiceDetail } from "../../services/userService";

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const userId = user.id;
  // Fetch service details by ID
  const getServiceDetail = async () => {
    try {
      const data = await fetchServiceDetail(serviceId);
      setService(data);
    } catch (error) {
      console.error("Error fetching service details:", error);
      toast.error("Error fetching service details");
    }
  };

  const handleAddToCart = async () => {
    const cartData = {
      userId, // Replace with actual user ID
      serviceId: service._id,
    };
    try {
      await dispatch(addToCart(cartData));
      toast.success("Service added to cart!");
      navigate("/cart");
      // Redirect to the cart page after adding to cart
    } catch (error) {
      toast.error("Failed to add service to cart");
      console.error("Failed to add service to cart:", error);
    }
  };

  useEffect(() => {
    getServiceDetail();
  }, [serviceId]);

  if (!service) {
    return (
      <div>
        <Header />
        <div className="text-center p-6">
          <p className="text-gray-500">Loading service details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <section className="container mx-auto max-w-[1200px] py-10 lg:grid lg:grid-cols-2 gap-10">
        {/* Service Image Gallery */}
        <div className="flex items-center justify-center lg:justify-start">
          <ReactImageGallery
            showBullets={false}
            showFullscreenButton={true}
            showPlayButton={false}
            showThumbnails={true}
            items={[
              {
                original: service.serviceImageUrl,
                thumbnail: service.serviceImageUrl,
              },
            ]}
            className="w-full lg:w-[80%] rounded-lg shadow-lg"
          />
        </div>

        {/* Service Description */}
        <div className="flex flex-col justify-center p-4 lg:p-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {service.name}
          </h1>
          <p className="text-lg font-semibold mt-2">
            Category:{" "}
            <span className="font-normal">
              {service.category?.name || "N/A"}
            </span>
          </p>
          <p className="text-2xl font-bold text-violet-900 mt-4">
            ₹{service.price}
          </p>
          <p className="text-md font-semibold mt-4">
            Expected Result Duration:{" "}
            <span className="font-normal">
              {service.expectedResultDuration}
            </span>
          </p>
          {service.description && (
            <p className="text-gray-600 mt-5 leading-7">
              {service.description}
            </p>
          )}
          {service.preTestPreparations?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Pre-test Preparations:
              </h3>
              <ul className="list-disc list-inside text-gray-600">
                {service.preTestPreparations.map((prep, index) => (
                  <li key={index}>{prep}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              className="flex w-full sm:w-auto items-center justify-center bg-violet-900 text-white py-3 px-8 font-semibold rounded-lg hover:bg-violet-800 transition"
              onClick={handleAddToCart}
            >
              <BiShoppingBag className="mr-2" />
              Book Now
            </button>
            <button className="flex w-full sm:w-auto items-center justify-center bg-amber-400 py-3 px-8 font-semibold rounded-lg hover:bg-amber-300 transition">
              <AiOutlineHeart className="mr-2" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
