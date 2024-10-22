import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import Sidebar from "../../components/AdminComponents/Sidebar";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get(`/bookings?page=${page}&limit=${limit}`);
      console.log(response.data, 'Fetched Bookings');
      
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Failed to fetch bookings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  if (loading) {
    return <p>Loading booking history...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-6 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Booking History</h1>
        {bookings.length > 0 ? (
          <div>
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Service</th>
                  <th className="py-3 px-6 text-center">Date</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Amount</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{booking.user_id?.name || "Unknown User"}</td>
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
                    <td className="py-3 px-6 text-center">{booking.status}</td>
                    <td className="py-3 px-6 text-center">₹{booking.total_amount}</td>
                    <td className="py-3 px-6 text-center">
                      <Link
                        to={`/admin/bookings/${booking._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                disabled={page === 1}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                disabled={page >= totalPages}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p>No bookings available.</p>
        )}
      </div>
    </div>
  );
}

export default Bookings;
