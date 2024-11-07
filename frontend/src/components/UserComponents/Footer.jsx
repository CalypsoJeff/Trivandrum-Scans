import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="text-sm text-center md:text-left mb-4 md:mb-0">
          COPYRIGHT © 2024 TRIVANDRUM SCANS
        </div>

        {/* Right Section */}
        <div className="text-sm text-center md:text-right">MADE BY JEFF</div>
      </div>
    </footer>
  );
};

export default Footer;
