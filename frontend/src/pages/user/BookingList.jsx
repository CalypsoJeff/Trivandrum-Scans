import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useSelector } from "react-redux";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { selectUser } from "../../features/auth/authSlice";
import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user?.id) {
          const response = await axiosInstanceUser.get(`/bookings/${user.id}`);
          setBookings(response.data);
          setLoading(false);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component */}
      <ProfileSidebar />

      {/* Main Content */}
      <div className="ml-64 p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Link
                to={`/booking/${booking._id}`} // Link to BookingDetails page with booking ID
                key={booking._id}
                className="block p-6 bg-white shadow-md rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Service: {booking.services[0]?.service_id?.name || "Unknown Service"}
                </h3>
                <p className="text-gray-600 mb-1">
                  <strong>Booked on:</strong> {new Date(booking.booking_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Time Slot:</strong> {booking.booking_time_slot}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Status:</strong> {booking.status}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Total Amount:</strong> ₹{booking.total_amount}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default BookingList;
