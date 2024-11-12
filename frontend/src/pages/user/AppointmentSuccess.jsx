// import React, { useEffect, useRef, useState } from "react";
// import { FaCheckCircle } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   clearCartInBackend,
//   initiateChatWithAdmin,
//   confirmBooking,
// } from "../../services/userService";

// function AppointmentSuccess() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const hasCalled = useRef(false);

//   const [appointmentDetails, setAppointmentDetails] = useState({
//     date: "",
//     service: "",
//     amount: "",
//   });

//   // Extract parameters from URL
//   const getQueryParams = (url) => {
//     const queryParams = new URLSearchParams(url.search);
//     return {
//       sessionId: queryParams.get("session_id"),
//       userId: queryParams.get("user_id"),
//       appointmentDate: queryParams.get("appointment_date"),
//       services: JSON.parse(queryParams.get("services")),
//       amount: queryParams.get("amount"),
//       appointmentTimeSlot: queryParams.get("appointment_time_slot"),
//     };
//   };

//   // Confirm booking, clear cart, and initiate chat
//   const handleBookingConfirmation = async (params) => {
//     try {
//       // Confirm booking
//       await confirmBooking(params);
//       console.log("Booking confirmed.");

//       // Clear user's cart in backend
//       await clearCartInBackend(params.userId);
//       console.log("Cart cleared.");

//       // Initiate chat and send confirmation message
//       await initiateChatWithAdmin(
//         params.userId,
//         params.services[0]?.name || "Service",
//         params.appointmentDate
//       );
//       console.log("Chat initiated with admin.");
//     } catch (error) {
//       console.error("Error during booking confirmation:", error);
//     }
//   };

//   useEffect(() => {
//     if (!hasCalled.current) {
//       hasCalled.current = true;
//       const params = getQueryParams(location);

//       setAppointmentDetails({
//         date: params.appointmentDate,
//         service: params.services[0]?.name || "Service",
//         amount: params.amount,
//       });

//       handleBookingConfirmation(params);
//     }
//   }, [location]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center">
//         <div className="mb-4">
//           <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Appointment Confirmed!
//         </h1>
//         <p className="text-gray-600 mb-6">
//           Thank you for booking your appointment. We have received your payment
//           and your appointment has been successfully scheduled.
//         </p>
//         <div className="bg-gray-100 p-4 rounded-lg mb-6">
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">
//             Appointment Details:
//           </h3>
//           <p className="text-gray-600">
//             Date:{" "}
//             <span className="font-semibold">{appointmentDetails.date}</span>
//           </p>
//           <p className="text-gray-600">
//             Service:{" "}
//             <span className="font-semibold">{appointmentDetails.service}</span>
//           </p>
//           <p className="text-gray-600">
//             Amount Paid:{" "}
//             <span className="font-semibold">₹{appointmentDetails.amount}</span>
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/home")}
//           className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 transition-all shadow-lg"
//         >
//           Go to Dashboard
//         </button>
//       </div>
//     </div>
//   );
// }

// export default AppointmentSuccess;

import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import axiosInstance from "../../services/axiosInstance";

function AppointmentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasCalled = useRef(false);

  const [appointmentDetails, setAppointmentDetails] = useState({
    date: "",
    service: "",
    amount: "",
  });

  // Extract parameters from URL
  const getQueryParams = (url) => {
    const queryParams = new URLSearchParams(url.search);
    return {
      sessionId: queryParams.get("session_id"),
      userId: queryParams.get("user_id"),
      appointmentDate: queryParams.get("appointment_date"),
      services: JSON.parse(queryParams.get("services")),
      amount: queryParams.get("amount"),
      appointmentTimeSlot: queryParams.get("appointment_time_slot"),
    };
  };

  // Clear user's cart in backend after booking confirmation
  const clearCartInBackend = async (userId) => {
    try {
      const response = await axiosInstanceUser.post(`/cart/clear`, { userId });
      console.log("Cart cleared:", response.data);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Initiate chat and send initial confirmation message to the user
  const initiateChatWithAdmin = async (userId, service, date) => {
    try {
      const { data } = await axiosInstanceUser.post(`/chat/start`, { userId });
      console.log("Chat initiated:", data);

      await axiosInstance.post(`/chat/${data.chatId}/send`, {
        content: `Your booking for ${service} on ${date} has been confirmed. Thank you!`,
      });
      console.log("Initial confirmation message sent to user.");
    } catch (error) {
      console.error("Error initiating chat:", error);
    }
  };

  // Confirm booking, clear cart, and initiate chat
  const confirmBooking = async (params) => {
    try {
      const response = await axiosInstanceUser.post("/confirm-booking", {
        sessionId: params.sessionId,
        userId: params.userId,
        appointmentDate: params.appointmentDate,
        services: params.services,
        amount: params.amount,
        appointmentTimeSlot: params.appointmentTimeSlot,
      });
      console.log("Booking confirmed:", response.data);

      // Post-confirmation tasks
      await clearCartInBackend(params.userId);
      await initiateChatWithAdmin(
        params.userId,
        params.services[0]?.name || "Service",
        params.appointmentDate
      );
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  useEffect(() => {
    if (!hasCalled.current) {
      hasCalled.current = true;
      const params = getQueryParams(location);

      setAppointmentDetails({
        date: params.appointmentDate,
        service: params.services[0]?.name || "Service",
        amount: params.amount,
      });

      confirmBooking(params);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center">
        <div className="mb-4">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Appointment Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for booking your appointment. We have received your payment
          and your appointment has been successfully scheduled.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Appointment Details:
          </h3>
          <p className="text-gray-600">
            Date:{" "}
            <span className="font-semibold">{appointmentDetails.date}</span>
          </p>
          <p className="text-gray-600">
            Service:{" "}
            <span className="font-semibold">{appointmentDetails.service}</span>
          </p>
          <p className="text-gray-600">
            Amount Paid:{" "}
            <span className="font-semibold">₹{appointmentDetails.amount}</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/home")}
          className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 transition-all shadow-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AppointmentSuccess;
