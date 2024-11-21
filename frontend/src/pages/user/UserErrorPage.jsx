/* eslint-disable react/prop-types */
// src/components/ErrorPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({ code = 404, message = "Page not found" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-500">{code}</h1>
      <p className="text-lg text-gray-700 mt-4">{message}</p>
      <button
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={() => navigate("/home")}
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default ErrorPage;
