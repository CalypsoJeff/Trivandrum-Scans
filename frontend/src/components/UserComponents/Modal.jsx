/* eslint-disable react/prop-types */
import React from "react";

const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-100"></div>
      <div className="absolute inset-0 bg-[url('https://marrymetampabay.com/wp-content/uploads/2018/02/18-8.jpg')] bg-cover opacity-50"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg text-center z-10">
        <h2 className="text-lg font-semibold mb-4">Notification</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#a39f74] hover:bg-[#9b976f] text-white font-bold py-2 px-4 rounded"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
