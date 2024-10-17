import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AppointmentSuccess() {
  const navigate = useNavigate();

  // Function to navigate back to the dashboard or home page
  const handleGoToDashboard = () => {
    navigate("/home"); // Update this route to your actual dashboard or home page route
  };

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
          Thank you for booking your appointment. we have received your payment
          and your appointment has been successfully scheduled.
        </p>

        {/* Appointment Details (can be customized further with actual details) */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Appointment Details:
          </h3>
          <p className="text-gray-600">
            Date: <span className="font-semibold">14th October 2024</span>
          </p>
          <p className="text-gray-600">
            Service: <span className="font-semibold">Health Checkup</span>
          </p>
          <p className="text-gray-600">
            Amount Paid: <span className="font-semibold">₹1900</span>
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
