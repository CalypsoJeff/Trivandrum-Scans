/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css"; // Include the cropper.css

const ServiceImageUploader = ({ setImageFile }) => {
  const [cropperInstance, setCropperInstance] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event?.target?.files[0];
    if (file) {
      const imageElement = document.getElementById("image-preview");
      const reader = new FileReader();

      reader.onload = (e) => {
        imageElement.src = e?.target?.result;
        if (cropperInstance) {
          cropperInstance.destroy();
        }
        const cropper = new Cropper(imageElement, {
          aspectRatio: 1, // Define the crop ratio (optional)
          viewMode: 2,
        });

        setCropperInstance(cropper);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperInstance) {
      const canvas = cropperInstance.getCroppedCanvas();
      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
        });
        setCroppedImage(croppedFile); // Correctly set the cropped image
        setImageFile(croppedFile); // Pass it back to parent via prop
      });
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      {/* File Upload Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Service Image
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Supported formats: JPG, PNG, WEBP
        </p>
      </div>

      {/* Image Preview and Cropper */}
      <div className="mb-4">
        <div className="w-full h-64 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
          <img
            id="image-preview"
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleCrop}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          Crop Image
        </button>
        <button
          disabled={!croppedImage}
          className={`${
            croppedImage
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          } text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200`}
        >
          Image Ready
        </button>
      </div>
    </div>
  );
};

export default ServiceImageUploader;
