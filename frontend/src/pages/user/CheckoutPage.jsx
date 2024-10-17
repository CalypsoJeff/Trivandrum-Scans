// import React, { useEffect, useState } from "react";
// import { FaUserCircle, FaPhoneAlt, FaHeart } from "react-icons/fa";
// import { BsFillPersonFill } from "react-icons/bs";
// import { MdEventAvailable } from "react-icons/md";
// import Header from "../../components/UserComponents/Header";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../features/auth/authSlice";
// import axiosInstanceUser from "../../services/axiosInstanceUser";
// import DatePicker from "react-datepicker"; // Date picker component
// import "react-datepicker/dist/react-datepicker.css"; // Date picker styles

// const CheckoutPage = () => {
//   const [cart, setCart] = useState(null); // Initialize cart as null
//   const [selectedDate, setSelectedDate] = useState(null); // Date picker state
//   const user = useSelector(selectUser); // Get user data from redux

//   // Fetch cart data (similar to CartPage)
//   const fetchCartData = async (userId) => {
//     try {
//       const response = await axiosInstanceUser.get(`/cart/${userId}`);
//       setCart(response.data); // Store the fetched cart data
//     } catch (error) {
//       console.error("Failed to fetch cart data:", error);
//     }
//   };

//   // Handle date change
//   const handleDateChange = (date) => {
//     setSelectedDate(date); // Set selected date
//   };

//   useEffect(() => {
//     if (user && user.id) {
//       fetchCartData(user.id); // Fetch cart data when user ID is available
//     }
//   }, [user]);

//   if (!cart) {
//     return <div>Loading checkout details...</div>;
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Header />
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Step Tracker */}
//         <div className="flex justify-center mb-8">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center">
//                 2
//               </div>
//               <span className="ml-2 text-teal-500 font-semibold">Step</span>
//             </div>
//             <div className="w-16 h-[2px] bg-gray-300"></div>
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gray-300 text-gray-400 rounded-full flex items-center justify-center">
//                 3
//               </div>
//               <span className="ml-2 text-gray-400">Step</span>
//             </div>
//           </div>
//         </div>

//         {/* Booking Details */}
//         <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             Checkout For
//           </h2>
//           <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg">
//             <FaUserCircle className="w-10 h-10 text-blue-500" />
//             <div className="flex-grow">
//               <h3 className="text-lg font-semibold">{user.name}</h3>
//               <p className="text-sm text-gray-500">Self</p>
//             </div>
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-1 text-gray-600">
//                 <BsFillPersonFill />
//                 <span>{user.gender}</span>
//               </div>
//               <div className="flex items-center space-x-1 text-gray-600">
//                 <MdEventAvailable />
//                 <span>{user.age}</span>
//               </div>
//               <div className="flex items-center space-x-1 text-gray-600">
//                 <FaPhoneAlt />
//                 <span>{user.contact}</span>
//               </div>
//               <div className="text-teal-500">
//                 <FaHeart />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Date Picker */}
//         <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             Select Appointment Date
//           </h2>

//           <div className="mb-4">
//             <DatePicker
//               selected={selectedDate}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="p-2 border rounded-lg"
//               placeholderText="Select a date"
//               minDate={new Date()} // Disable past dates
//             />
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             Order Summary
//           </h2>
//           {cart.services && cart.services.length > 0 ? (
//             <>
//               {cart.services.map((service) => (
//                 <div
//                   key={service._id}
//                   className="flex justify-between items-center border-b pb-4 mb-4"
//                 >
//                   <div className="flex-grow">
//                     <h3 className="text-md font-semibold text-gray-700">
//                       {service.serviceId.name}
//                     </h3>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <p className="text-red-500 text-lg font-bold mr-4">
//                       ₹{service.serviceId.price}
//                     </p>
//                   </div>
//                 </div>
//               ))}

//               {/* Payment Details */}
//               <div className="flex justify-between items-center mt-4 border-t pt-4">
//                 <h3 className="text-lg font-semibold text-gray-700">
//                   Total Amount:
//                 </h3>
//                 <p className="text-red-500 text-lg font-bold">
//                   ₹
//                   {cart.services.reduce(
//                     (total, service) => total + service.serviceId.price,
//                     0
//                   )}
//                 </p>
//               </div>

//               {/* Proceed to Payment */}
//               <div className="flex justify-end mt-6">
//                 <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow">
//                   Proceed to Payment
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="text-center text-gray-500">
//               <h3 className="text-xl font-semibold">
//                 No services available for checkout
//               </h3>
//               <p className="mt-2">
//                 Add services to your cart to proceed with checkout.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import Header from "../../components/UserComponents/Header";
import { selectUser } from "../../features/auth/authSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_test_51Q9p4J02sEEeH3srV1uPSqW1QISpZpbEFDQNV8cGWHBGtONEe0IpxG7EiOZrledVR7xzNnKXhLeRObuRH2ZsnYWh00oHBEyis6"
);

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const user = useSelector(selectUser);
  //   const dispatch = useDispatch();

  // Fetch cart data
  const fetchCartData = async (userId) => {
    try {
      const response = await axiosInstanceUser.get(`/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle Proceed to Payment
  const handleProceedToPayment = async () => {
    // Calculate total amount
    const totalAmount = cart.services.reduce(
      (total, service) => total + service.serviceId.price,
      0
    );

    // Create booking data to send to the backend
    const bookingData = {
      userId: user.id,
      services: cart.services.map((service) => service.serviceId._id),
      appointmentDate: selectedDate,
      totalAmount,
    };

    try {
      // Send booking data to the backend to create a Stripe Checkout session
      const response = await axiosInstanceUser.post(
        "/booknowcheckout",
        bookingData
      );
      const { sessionId } = response.data; // The backend should return the Stripe sessionId

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        console.error("Stripe.js failed to load.");
      }
    } catch (error) {
      console.error("Error creating booking and Stripe session:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchCartData(user.id);
    }
  }, [user]);

  if (!cart) {
    return <div>Loading checkout details...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center">
              2
            </div>
            <div className="w-16 h-[2px] bg-gray-300"></div>
            <div className="w-8 h-8 bg-gray-300 text-gray-400 rounded-full flex items-center justify-center">
              3
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Checkout For
          </h2>
          <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg">
            <FaUserCircle className="w-10 h-10 text-blue-500" />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">Self</p>
            </div>
          </div>
        </div>

        {/* Date Picker */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Select Appointment Date
          </h2>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="p-2 border rounded-lg"
            placeholderText="Select a date"
            minDate={new Date()}
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Order Summary
          </h2>
          {cart.services && cart.services.length > 0 ? (
            <>
              {cart.services.map((service) => (
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
                  </div>
                </div>
              ))}

              {/* Payment Details */}
              <div className="flex justify-between items-center mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Amount:
                </h3>
                <p className="text-red-500 text-lg font-bold">
                  ₹
                  {cart.services.reduce(
                    (total, service) => total + service.serviceId.price,
                    0
                  )}
                </p>
              </div>

              {/* Proceed to Payment */}
              <div className="flex justify-end mt-6">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow"
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <h3 className="text-xl font-semibold">
                No services available for checkout
              </h3>
              <p className="mt-2">
                Add services to your cart to proceed with checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
