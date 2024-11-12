import React from "react";
import Header from "../../components/UserComponents/Header";
import Footer from "../../components/UserComponents/Footer";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/service");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
            Welcome to <span className="text-blue-600">Trivandrum Scans</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Your health is our priority. At Trivandrum Scans, we provide
            state-of-the-art diagnostic imaging services to ensure you receive
            the best care possible.
          </p>
          <p className="text-lg sm:text-xl text-gray-600">
            Our expert team is here to guide you on your path to health and
            well-being.
          </p>
          <button
            className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            onClick={handleClick}
          >
            Explore Our Services
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
