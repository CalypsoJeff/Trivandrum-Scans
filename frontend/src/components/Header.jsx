import React, { useState, useRef } from 'react';
import LoginModal from '../pages/user/Login';
import SignupModal from '../pages/user/Signup';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const timeoutRef = useRef(null);

  // Open modals
  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleOpenSignupModal = () => {
    setShowSignupModal(true);
  };

  // Close modals
  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(null);
    }, 200); // Adjust the delay (200ms) as needed
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 shadow-lg bg-white">
        <div className="flex items-center">
          <img src="/Images/trivandrum scans .jpg" alt="Logo" className="h-20" />
        </div>

        


 {/* Navigation Links */}
 <nav className="flex space-x-8 text-gray-700">
 <button className="hover:text-teal-500 transition relative">
   Home
   <span className="block w-full h-0.5 bg-teal-500 absolute bottom-0 left-0 scale-x-0 hover:scale-x-100 transition-transform origin-left"></span>
 </button>

 <div
   className="relative"
   onMouseEnter={() => handleMouseEnter('trivandrumScans')}
   onMouseLeave={handleMouseLeave}
 >
   <button className="hover:text-teal-500 transition">
     Trivandrum Scans For You
   </button>
   {isDropdownOpen === 'trivandrumScans' && (
     <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg">
       <div className="h-1 bg-teal-500 rounded-t-md"></div> {/* Teal Line */}
       <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full">
         About Us
       </button>
       <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full">
         Our Mission
       </button>
       <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full">
         Panel of Doctors
       </button>
       <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full rounded-b-md">
         Corporate Enquiry
       </button>
     </div>
   )}
 </div>

 <div
   className="relative"
   onMouseEnter={() => handleMouseEnter('forPatients')}
   onMouseLeave={handleMouseLeave}
 >
   <button className="hover:text-teal-500 transition">
     For Patients
   </button>
   {isDropdownOpen === 'forPatients' && (
     <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg">
       <div className="h-1 bg-teal-500 rounded-t-md"></div> {/* Teal Line */}
       <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full">
         Book a Test
       </button>
       <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full">
         Book a Home Collection
       </button>
       <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full rounded-b-md">
         Reports
       </button>
     </div>
   )}
 </div>

 <div
   className="relative"
   onMouseEnter={() => handleMouseEnter('services')}
   onMouseLeave={handleMouseLeave}
 >
   <button className="hover:text-teal-500 transition">
     Services
   </button>
   {isDropdownOpen === 'services' && (
     <div className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg">
       <div className="h-1 bg-teal-500 rounded-t-md"></div> {/* Teal Line */}
       <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full rounded-t-md">
         Imaging Services
       </button>
       <button className="block px-4 py-2 text-left hover:bg-teal-500 transition w-full rounded-b-md">
         Laboratory Services
       </button>
     </div>
   )}
 </div>

 <button className="hover:text-teal-500 transition relative">
   Health Packages
   <span className="block w-full h-0.5 bg-teal-500 absolute bottom-0 left-0 scale-x-0 hover:scale-x-100 transition-transform origin-left"></span>
 </button>
 <button className="hover:text-teal-500 transition relative">
   Gallery
   <span className="block w-full h-0.5 bg-teal-500 absolute bottom-0 left-0 scale-x-0 hover:scale-x-100 transition-transform origin-left"></span>
 </button>
 <button className="hover:text-teal-500 transition relative">
   Contact Us
   <span className="block w-full h-0.5 bg-teal-500 absolute bottom-0 left-0 scale-x-0 hover:scale-x-100 transition-transform origin-left"></span>
 </button>
</nav>

        <div className="flex items-center space-x-4">
          <button
            className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition"
            onClick={handleOpenLoginModal}
          >
            Login
          </button>
          <button
            className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition"
            onClick={handleOpenSignupModal}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Modals */}
      {showLoginModal && <LoginModal show={showLoginModal} onClose={handleCloseModals} />}
      {showSignupModal && <SignupModal show={showSignupModal} onClose={handleCloseModals} />}
    </div>
  );
};

export default Header;







