/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { selectUser } from "../../features/auth/authSlice";
import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";
import SearchSortFilter from "../../components/UserComponents/SearchSortFilter";
import { fetchUserBookings } from "../../services/userService";

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector(selectUser);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        if (user?.id) {
          const data = await fetchUserBookings(user.id);
          setBookings(data);
          setFilteredBookings(data);
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    loadBookings();
  }, [user?.id]);

  // Search handler
  const handleSearch = (searchText) => {
    const filtered = bookings.filter((booking) =>
      booking.services[0]?.service_id?.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  // Sort handler
  const handleSort = (sortValue) => {
    let sortedBookings = [...filteredBookings];
    if (sortValue === "amount") {
      sortedBookings.sort((a, b) => b.total_amount - a.total_amount);
    } else if (sortValue === "date") {
      sortedBookings.sort(
        (a, b) => new Date(b.booking_date) - new Date(a.booking_date)
      );
    }
    setFilteredBookings(sortedBookings);
  };

  // Filter handler
  const handleFilter = (filterValue) => {
    const filtered = bookings.filter((booking) =>
      filterValue ? booking.status === filterValue : true
    );
    setFilteredBookings(filtered);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
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
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          My Bookings
        </h1>
        <SearchSortFilter
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={handleFilter}
          filters={[
            { label: "Status: Confirmed", value: "confirmed" },
            { label: "Status: Cancelled", value: "cancelled" },
            { label: "Status: Pending", value: "pending" },
            // Add filter options for service type, if available
          ]}
          sorts={[
            { label: "Amount", value: "amount" },
            { label: "Booking Date", value: "booking_date" },
            { label: "Appointment Date", value: "appointment_date" },
            // Add more sort options if needed
          ]}
          searchPlaceholders={["Search by Service Name"]}
        />

        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredBookings.map((booking) => (
              <Link
                to={`/booking/${booking._id}`}
                key={booking._id}
                className="block bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:bg-gray-50 transition duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-teal-500 text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg">
                    {booking.services[0]?.service_id?.name[0] || "S"}
                  </div>
                  <h3 className="ml-4 text-2xl font-semibold text-gray-800">
                    {booking.services[0]?.service_id?.name || "Unknown Service"}
                  </h3>
                </div>
                <div className="text-gray-700 space-y-2">
                  <p>
                    <strong>Booking Date:</strong>{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Appointment Date:</strong>{" "}
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time Slot:</strong> {booking.booking_time_slot}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`${
                        booking.status === "confirmed"
                          ? "font-semibold"
                          : "text-red-600 font-semibold"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹{booking.total_amount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default BookingList;
