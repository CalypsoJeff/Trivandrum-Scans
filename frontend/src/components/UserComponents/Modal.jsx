/* eslint-disable react/prop-types */
import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Notice</h2>
        <button
          onClick={onClose} // Close the modal
          className="text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          <AiOutlineCloseCircle size={24} />
        </button>
      </div>
      <div className="text-gray-600 text-sm">
        <p>{message}</p>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onClose} // Close the modal
          className="px-6 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
