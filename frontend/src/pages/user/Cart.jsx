import React, { useEffect, useState } from "react";
import { FaUserCircle, FaTrash, FaHeart, FaPhoneAlt } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { MdEventAvailable } from "react-icons/md";
import Header from "../../components/UserComponents/Header";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import axiosInstanceUser from "../../api/middlewares/axiosInstanceUser";
import { removeFromCart } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedServiceAssignments, setSelectedServiceAssignments] = useState(
    {}
  ); // Track selected services for multiple persons

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle proceed to checkout
  const handleProceed = () => {
    if (Object.keys(selectedServiceAssignments).length === 0) {
      alert("Please assign services to users.");
      return;
    }

    // Create the payload for updating the cart
    const servicesToUpdate = Object.keys(selectedServiceAssignments).map(
      (serviceId) => ({
        serviceId,
        personIds: selectedServiceAssignments[serviceId],
      })
    );
    axiosInstanceUser
      .post(`/cart/update/${user.id}`, { services: servicesToUpdate })
      .then((response) => {
        console.log(response, "sdsdbsdhsdhvsdhvsd");
        navigate("/checkout", {
          state: { serviceAssignments: selectedServiceAssignments },
        });
      })
      .catch((error) => {
        console.error("Error updating cart:", error);
        alert("Failed to update cart before checkout.");
      });
  };

  // Fetch cart data
  const fetchCartData = async (userId) => {
    try {
      const response = await axiosInstanceUser.get(`/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  };

  // Fetch family members
  const fetchFamilyMembers = async (userId) => {
    try {
      const response = await axiosInstanceUser.get(`/familyData/${userId}`);
      setFamilyMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch family data:", error);
    }
  };

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

  const handleAssignServiceToPerson = (serviceId, personId) => {
    setSelectedServiceAssignments((prevAssignments) => {
      const existingAssignments = prevAssignments[serviceId] || [];
      let updatedAssignments;

      if (existingAssignments.includes(personId)) {
        updatedAssignments = existingAssignments.filter(
          (id) => id !== personId
        );
      } else {
        updatedAssignments = [...existingAssignments, personId];
      }

      return {
        ...prevAssignments,
        [serviceId]: updatedAssignments,
      };
    });
  };

  useEffect(() => {
    if (user && user.id) {
      fetchCartData(user.id);
      fetchFamilyMembers(user.id);
    }
  }, [user]);

  if (!cart) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        {/* Booking Person Selection */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Test Booking For
          </h2>
          <div className="space-y-4">
            {/* Option to select the logged-in user */}
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

            {/* Option to select family members */}
            {familyMembers.length > 0 &&
              familyMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg"
                >
                  <FaUserCircle className="w-10 h-10 text-blue-500" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-500">
                      {member.relationToUser}
                    </p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <BsFillPersonFill />
                      <span>{member.gender}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MdEventAvailable />
                      <span>{member.age}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <FaPhoneAlt />
                      <span>{member.contactNumber}</span>
                    </div>
                    <div className="text-teal-500">
                      <FaHeart />
                    </div>
                  </div>
                </div>
              ))}
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
                  <div className="mt-2">
                    <label htmlFor="personSelect" className="text-sm">
                      Assign to:
                    </label>
                    <div className="ml-2">
                      <label>
                        <input
                          type="checkbox"
                          onChange={() =>
                            handleAssignServiceToPerson(
                              service.serviceId._id,
                              user.id
                            )
                          }
                          checked={
                            selectedServiceAssignments[
                              service.serviceId._id
                            ]?.includes(user.id) || false
                          }
                        />
                        {user.name} (Self)
                      </label>
                      {familyMembers.map((member) => (
                        <label key={member._id} className="ml-4">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleAssignServiceToPerson(
                                service.serviceId._id,
                                member._id
                              )
                            }
                            checked={
                              selectedServiceAssignments[
                                service.serviceId._id
                              ]?.includes(member._id) || false
                            }
                          />
                          {member.name} ({member.relationToUser})
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-red-500 text-lg font-bold mr-4">
                    ₹{service.serviceId.price}
                  </p>
                  <div className="flex items-center space-x-4">
                    <FaHeart className="text-gray-500 cursor-pointer hover:text-red-500" />
                    <FaTrash
                      className="text-gray-500 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemove(service.serviceId._id)}
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
