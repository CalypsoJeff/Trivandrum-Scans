import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/UserComponents/Header";
import { selectUser } from "../../features/auth/authSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Q9p4J02sEEeH3srV1uPSqW1QISpZpbEFDQNV8cGWHBGtONEe0IpxG7EiOZrledVR7xzNnKXhLeRObuRH2ZsnYWh00oHBEyis6"
);

const CheckoutPage = () => {
  const [cart, setCart] = useState(null); // Store cart data
  const [patients, setPatients] = useState([]); // Store patient data
  const [selectedDate, setSelectedDate] = useState(null); // Store selected appointment date
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // Store selected time slot
  const user = useSelector(selectUser);

  // Define available time slots
  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "2:30 PM - 3:30 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
  ];

  // Fetch cart data
  const fetchCartData = async (userId) => {
    try {
      const response = await axiosInstanceUser.get(`/cart/latest/${userId}`);
      const { cart, patients } = response.data;
      setCart(cart);
      setPatients(patients); // Store patient data
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  };

  // Handle date selection for appointment
  const handleDateChange = (date) => {
    setSelectedDate(date); // Set selected appointment date
  };

  // Handle time slot selection
  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value); // Set selected time slot
  };

  // Handle proceeding to payment via Stripe
  const handleProceedToPayment = async () => {
    // Calculate totalAmount
    const totalAmount = cart.services.reduce((total, service) => {
      const numberOfPersons = service.personIds.length;
      return total + service.serviceId.price * numberOfPersons;
    }, 0);

    // Construct booking data
    const bookingData = {
      userId: user.id,
      services: cart.services.map((service) => ({
        serviceId: service.serviceId._id,
        personIds: service.personIds,
      })),
      appointmentDate: selectedDate,
      appointmentTimeSlot: selectedTimeSlot, // Include the selected time slot
      totalAmount, // Now this is defined
    };

    try {
      const response = await axiosInstanceUser.post(
        "/booknowcheckout",
        bookingData
      );
      const { sessionId } = response.data;

      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        console.error("Stripe.js failed to load.");
      }
    } catch (error) {
      console.error("Error creating booking and Stripe session:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchCartData(user.id); // Fetch cart data
    }
  }, [user]);

  if (!cart) {
    return <div>Loading checkout details...</div>;
  }

  // Helper function to get patient details by ID or fallback to user
  const getPersonDetails = (personId) => {
    const patient = patients.find((patient) => patient._id === personId);
    if (patient) {
      return {
        name: patient.name,
        relation: patient.relationToUser,
      };
    } else if (personId === user.id) {
      return {
        name: user.name,
        relation: "Self",
      };
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        {/* Step tracker */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center">
              2
            </div>
            <div className="w-16 h-[2px] bg-gray-300"></div>
            <div className="w-8 h-8 bg-gray-300 text-gray-400 rounded-full flex items-center justify-center">
              3
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Checkout For
          </h2>
          {cart.services.map((service) => (
            <div
              key={service.serviceId._id}
              className="flex flex-col space-y-2 border-b border-gray-200 pb-4 mb-4"
            >
              <h3 className="text-md font-semibold text-gray-700">
                {service.serviceId.name}
              </h3>
              <ul className="list-disc list-inside">
                {service.personIds.length > 0 ? (
                  service.personIds.map((person) => {
                    const personDetails = getPersonDetails(person._id);
                    return (
                      <li key={person._id}>
                        {personDetails
                          ? `${personDetails.name} (${personDetails.relation})`
                          : "Unknown Person"}
                      </li>
                    );
                  })
                ) : (
                  <li>No person assigned</li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Date Picker for Appointment */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Select Appointment Date
          </h2>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="p-2 border rounded-lg"
            placeholderText="Select a date"
            minDate={new Date()} // Disable past dates
          />
        </div>

        {/* Time Slot Selection - Show only if a date is selected */}
        {selectedDate && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Select Appointment Time Slot
            </h2>
            <select
              value={selectedTimeSlot}
              onChange={handleTimeSlotChange}
              className="p-2 border rounded-lg"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Order Summary
          </h2>
          {cart.services.map((service) => (
            <div
              key={service.serviceId._id}
              className="flex justify-between items-center border-b pb-4 mb-4"
            >
              <div className="flex-grow">
                <h3 className="text-md font-semibold text-gray-700">
                  {service.serviceId.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Quantity: {service.personIds.length}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-red-500 text-lg font-bold mr-4">
                  ₹{service.serviceId.price} x {service.personIds.length} = ₹
                  {service.serviceId.price * service.personIds.length}
                </p>
              </div>
            </div>
          ))}

          {/* Payment Total */}
          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Amount:
            </h3>
            <p className="text-red-500 text-lg font-bold">
              ₹
              {cart.services.reduce((total, service) => {
                return (
                  total + service.serviceId.price * service.personIds.length
                );
              }, 0)}
            </p>
          </div>

          {/* Proceed to Payment Button */}
          <div className="flex justify-end mt-6">
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow"
              onClick={handleProceedToPayment}
              disabled={!selectedDate || !selectedTimeSlot} // Disable button if date or time slot is not selected
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
