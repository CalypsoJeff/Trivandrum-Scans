import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";

function BookingDetails() {
  const { id } = useParams(); // Get the booking ID from the URL
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstanceUser.get(`/booking/user/${id}`);
        setBooking(response.data);
        setLoading(false);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to fetch booking details");
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading booking details...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Component */}
      <ProfileSidebar />

      {/* Main Content */}
      <div className="ml-64 p-8 flex-grow">
        {booking ? (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">
              Booking Details
            </h1>

            {/* User Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                User Information
              </h2>
              <p className="text-gray-600 text-lg">
                <strong>Name:</strong> {booking.user_id?.name}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Email:</strong> {booking.user_id?.email}
              </p>
            </div>

            {/* Booking Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Booking Information
              </h2>
              <p className="text-gray-600 text-lg">
                <strong>Booked on:</strong>{" "}
                {new Date(booking.booking_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Time Slot:</strong> {booking.booking_time_slot}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    booking.status === "confirmed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Total Amount:</strong> ₹{booking.total_amount}
              </p>
            </div>

            {/* Services Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Services and Persons
              </h2>
              {booking.services.length > 0 ? (
                booking.services.map((service, index) => (
                  <div
                    key={service.service_id?._id}
                    className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm border"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      Service {index + 1}: {service.service_id?.name}
                    </h3>
                    <p className="text-gray-600 text-md mb-2">
                      <strong>Price:</strong> ₹{service.service_id?.price}
                    </p>

                    <h4 className="font-semibold text-md mt-4">Persons:</h4>
                    {service.persons.length > 0 ? (
                      <ul className="list-disc list-inside ml-6 text-gray-600">
                        {service.persons.map((person) => (
                          <li key={person._id} className="mt-1">
                            <strong>{person.name}</strong> (
                            {person.relationToUser}, {person.age} years,{" "}
                            {person.gender})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        No persons listed for this service.
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No services available.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No booking details available.
          </p>
        )}
      </div>
    </div>
  );
}

export default BookingDetails;
