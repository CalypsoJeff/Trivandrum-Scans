import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import Sidebar from "../../components/AdminComponents/Sidebar";

function BookingDetail() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookingDetail = async () => {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      setBooking(response.data);
      setLoading(false);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Failed to fetch booking details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetail();
  }, [bookingId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading booking details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!booking) {
    return <p className="text-center text-gray-500">No booking details available</p>;
  }

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-6 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Details</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">User Information</h2>
            <p className="text-gray-600"><strong>Name:</strong> {booking.user_id?.name || "Unknown User"}</p>
            <p className="text-gray-600"><strong>Email:</strong> {booking.user_id?.email || "Not Available"}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Booking Information</h2>
            <p className="text-gray-600"><strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
            <p className="text-gray-600"><strong>Booking Time Slot:</strong> {booking.booking_time_slot}</p>
            <p className="text-gray-600"><strong>Status:</strong> <span className="text-green-600 font-medium">{booking.status}</span></p>
            <p className="text-gray-600"><strong>Total Amount:</strong> ₹{booking.total_amount}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Services and Persons</h2>
            {booking.services.length > 0 ? (
              booking.services.map((service) => (
                <div key={service.service_id?._id} className="bg-gray-100 rounded-lg p-4 mb-4 shadow-sm">
                  <div className="mb-2">
                    <h4 className="font-medium text-lg text-gray-800">
                      Service: {service.service_id?.name || "Unknown Service"}
                    </h4>
                    <p className="text-gray-600">Price: ₹{service.service_id?.price}</p>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-semibold text-gray-700">Booked By:</h5>
                    <ul className="list-disc list-inside text-gray-600">
                      {service.persons.length > 0 ? (
                        service.persons.map((person) => (
                          <li key={person._id}>
                            {person.name} ({person.relationToUser}, {person.age} years old, {person.gender})
                          </li>
                        ))
                      ) : (
                        <li>No persons listed</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No services listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;
