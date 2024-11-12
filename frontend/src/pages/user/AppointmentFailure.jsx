import React from "react";
import { useNavigate } from "react-router-dom";

function AppointmentFailure() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/booking"); // Redirect to booking page (adjust this path as needed)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-red-500">Appointment Failed</h1>
      <p className="mt-2 text-center text-gray-700">
        Unfortunately, your appointment booking was not successful. Please try
        again.
      </p>
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={handleRetry}
      >
        Retry Booking
      </button>
    </div>
  );
}

export default AppointmentFailure;
