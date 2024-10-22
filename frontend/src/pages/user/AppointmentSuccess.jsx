import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstanceUser from "../../services/axiosInstanceUser";

function AppointmentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [appointmentDetails, setAppointmentDetails] = useState({
    date: "",
    service: "",
    amount: "",
  });

  // Function to parse query parameters from the URL
  const getQueryParams = (url) => {
    const queryParams = new URLSearchParams(url.search);
    return {
      sessionId: queryParams.get("session_id"),
      userId: queryParams.get("user_id"),
      appointmentDate: queryParams.get("appointment_date"),
      services: JSON.parse(queryParams.get("services")),
      amount: queryParams.get("amount"),
      appointmentTimeSlot: queryParams.get("appointment_time_slot"), // Include the appointment time slot
    };
  };

  // Function to navigate back to the dashboard or home page
  const handleGoToDashboard = () => {
    navigate("/home"); // Update this route to your actual dashboard or home page route
  };

  useEffect(() => {
    const params = getQueryParams(location);

    // Set appointment details based on the query params
    setAppointmentDetails({
      date: params.appointmentDate,
      service: params.services[0]?.name || "Service",
      amount: params.amount,
    });

    // Send request to confirm booking in the backend
    axiosInstanceUser
      .post("/confirm-booking", {
        sessionId: params.sessionId,
        userId: params.userId,
        appointmentDate: params.appointmentDate,
        services: params.services,
        amount: params.amount,
        appointmentTimeSlot: params.appointmentTimeSlot,
      })
      .then((response) => {
        console.log("Booking confirmed:", response.data);
      })
      .catch((error) => {
        console.error("Error confirming booking:", error);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center">
        {/* Success Icon */}
        <div className="mb-4">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Appointment Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for booking your appointment. We have received your payment
          and your appointment has been successfully scheduled.
        </p>

        {/* Appointment Details */}
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

        {/* Go to Dashboard Button */}
        <button
          onClick={handleGoToDashboard}
          className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 transition-all shadow-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AppointmentSuccess;
