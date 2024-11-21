/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/UserComponents/Header";
import { selectUser } from "../../features/auth/authSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  createBookingSession,
  fetchLatestCart,
} from "../../services/userService";
import { toast } from "sonner";

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

  // Check if a time slot is disabled
  const isTimeSlotDisabled = (slot) => {
    if (!selectedDate) return false; // If no date is selected, all slots are enabled

    const [startTime, endTime] = slot.split(" - ").map((time) => {
      const [hours, minutes] = time.match(/\d+/g).map(Number);
      const isPM = time.includes("PM");
      return new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        isPM && hours !== 12 ? hours + 12 : hours, // Convert PM to 24-hour format
        minutes
      );
    });

    const now = new Date();

    // If the selected date is today, compare the time slot's end time with the current time
    return now.toDateString() === selectedDate.toDateString() && now > endTime;
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(""); // Reset time slot selection when date changes
  };

  // Handle time slot selection
  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value);
  };

  // Load cart data
  const loadCartData = async (userId) => {
    try {
      const { cart, patients } = await fetchLatestCart(userId);
      setCart(cart);
      setPatients(patients);
    } catch (error) {
      console.error("Failed to load cart data", error);
    }
  };

  // Handle proceeding to payment via Stripe
  const handleProceedToPayment = async () => {
    if (!selectedDate) {
      toast.error("Please select a date for your appointment.");
      return;
    }

    if (!selectedTimeSlot) {
      toast.error("Please select a time slot for your appointment.");
      return;
    }

    // Calculate total amount
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
      appointmentTimeSlot: selectedTimeSlot,
      totalAmount,
    };

    try {
      const { sessionId } = await createBookingSession(bookingData);

      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        toast.error("Stripe.js failed to load.");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Booking conflict detected.");
      } else {
        toast.error("Error creating booking. Please try again.");
      }
      console.error("Error creating booking and Stripe session:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      loadCartData(user.id);
    }
  }, [user]);

  if (!cart) {
    return <div>Loading checkout details...</div>;
  }

  // Get patient details by ID or fallback to user
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
                {service.personIds.map((person) => {
                  const personDetails = getPersonDetails(person._id);
                  return (
                    <li key={person._id}>
                      {personDetails
                        ? `${personDetails.name} (${personDetails.relation})`
                        : "Unknown Person"}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Date Picker */}
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
            minDate={new Date()}
          />
        </div>

        {/* Time Slot Selection */}
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
                <option
                  key={index}
                  value={slot}
                  disabled={isTimeSlotDisabled(slot)}
                >
                  {slot} {isTimeSlotDisabled(slot) ? "(Unavailable)" : ""}
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

          <div className="flex justify-end mt-6">
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow"
              onClick={handleProceedToPayment}
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
