/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/AdminComponents/Sidebar";
import axiosInstance from "../../services/axiosInstance";
import SearchSortFilter from "../../components/AdminComponents/SearchSortFilter";
import { fetchBookings } from "../../services/adminService";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const loadBookings = async () => {
    try {
      const data = await fetchBookings(page, limit);
      setBookings(data.bookings);
      setFilteredBookings(data.bookings);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch bookings. Please try again.");
      setLoading(false);
    }
  };

  const handleSearch = (searchText) => {
    const filtered = bookings.filter(
      (booking) =>
        booking.user_id?.name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        booking.services.some((service) =>
          service.service_id?.name
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
    );
    setFilteredBookings(filtered);
  };

  const handleSort = (sortField, sortOrder) => {
    let sortedBookings = [...filteredBookings];
    sortedBookings.sort((a, b) => {
      const comparison =
        sortField === "amount"
          ? a.total_amount - b.total_amount
          : sortField === "status"
          ? a.status.localeCompare(b.status)
          : new Date(a[sortField]) - new Date(b[sortField]);

      return sortOrder === "asc" ? comparison : -comparison;
    });
    setFilteredBookings(sortedBookings);
  };

  const handleFilter = (filterValue) => {
    const filtered = bookings.filter((booking) =>
      filterValue ? booking.status === filterValue : true
    );
    setFilteredBookings(filtered);
  };

  useEffect(() => {
    loadBookings();
  }, [page]);

  if (loading) return <p>Loading booking history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Booking History</h1>
        <SearchSortFilter
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={handleFilter}
          filters={[
            { label: "Confirmed", value: "confirmed" },
            { label: "Cancelled", value: "cancelled" },
            { label: "Pending", value: "pending" },
          ]}
          sorts={[
            { label: "Appointment Date", value: "booking_date" },
            { label: "Booking Date", value: "createdAt" },
            { label: "Amount", value: "amount" },
            { label: "Status", value: "status" },
          ]}
        />
        {filteredBookings.length > 0 ? (
          <div>
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Service</th>
                  <th className="py-3 px-6 text-center">Appointment Date</th>
                  <th className="py-3 px-6 text-center">Booking Date</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Amount</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left">
                      {booking.user_id?.name || "Unknown User"}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {booking.services.length > 0 ? (
                        booking.services.map((service) => (
                          <div key={service.service_id?._id}>
                            {service.service_id?.name || "Unknown Service"}
                          </div>
                        ))
                      ) : (
                        <p>No services listed</p>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`py-1 px-3 font-semibold ${
                          booking.status === "confirmed"
                            ? "text-gray-800"
                            : booking.status === "cancelled"
                            ? "text-gray-500"
                            : "text-gray-600"
                        } border ${
                          booking.status === "confirmed"
                            ? "border-gray-800"
                            : booking.status === "cancelled"
                            ? "border-gray-400"
                            : "border-gray-500"
                        } rounded-full`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      ₹{booking.total_amount}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <Link
                        to={`/admin/bookings/${booking._id}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                disabled={page === 1}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prevPage) => Math.min(prevPage + 1, totalPages))
                }
                disabled={page >= totalPages}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No bookings available.</p>
        )}
      </div>
    </div>
  );
}

export default Bookings;
