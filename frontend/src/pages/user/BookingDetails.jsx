/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileSidebar from "../../components/UserComponents/ProfileSidebar";
import { toast } from "sonner";
import {
  cancelBooking,
  fetchBookingDetails,
  fetchReports,
} from "../../services/userService";

function BookingDetails() {
  const { id } = useParams(); 
  const [booking, setBooking] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch booking and report data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        // Fetch booking and report data in parallel
        const [bookingData, reportData] = await Promise.all([
          fetchBookingDetails(id),
          fetchReports(id),
        ]);
        setBooking(bookingData);
        setReports(reportData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [id]);

  // Determine if the booking can be canceled
  const canCancel =
    booking &&
    !booking.services.some((service) => service.completed) &&
    new Date(booking.booking_date) - new Date() > 24 * 60 * 60 * 1000;

  const handleCancelBooking = async () => {
    try {
      await cancelBooking(id);
      setBooking((prevBooking) => ({
        ...prevBooking,
        status: "cancelled",
      }));
      setShowModal(false);
      toast.success(
        "Booking canceled successfully. Money refunded to your account."
      );
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      setShowModal(false);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (loading)
    return <p className="text-center mt-10">Loading booking details...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfileSidebar />
      <div className="ml-64 p-8 flex-grow">
        {booking ? (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800 border-b pb-4">
              Booking Details
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  User Information
                </h2>
                <p className="text-gray-600">
                  <strong>Name:</strong> {booking.user_id?.name}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {booking.user_id?.email}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  Booking Information
                </h2>
                <p className="text-gray-600">
                  <strong>Booking Date:</strong>{" "}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Appointment Date:</strong>{" "}
                  {new Date(booking.booking_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Time Slot:</strong> {booking.booking_time_slot}
                </p>
                <p className="text-gray-600">
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
                <p className="text-gray-600">
                  <strong>Total Amount:</strong> ₹{booking.total_amount}
                </p>
              </div>
            </div>

            {/* Attached Reports Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center border-b pb-4">
                Attached Reports
              </h2>
              {reports.length > 0 ? (
                <div className="flex flex-col space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                    >
                      <p className="text-gray-600">
                        <strong>Booking ID:</strong> {report.bookingId}
                      </p>
                      <p className="text-gray-600">
                        <strong>Published:</strong>{" "}
                        {report.published ? "Yes" : "No"}
                      </p>
                      <p className="text-gray-600">
                        <strong>Uploaded On:</strong>{" "}
                        {new Date(report.uploadedAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2">
                        <strong className="block text-gray-700">Files:</strong>
                        {report.files && report.files.length > 0 ? (
                          report.files.map((file, index) => (
                            <a
                              key={index}
                              href={file.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline block mt-1"
                            >
                              {file.filename}
                            </a>
                          ))
                        ) : (
                          <p className="text-gray-500">No files attached.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  No reports available.
                </p>
              )}
            </div>

            {canCancel && booking.status === "confirmed" && (
              <div className="flex justify-end">
                <button
                  onClick={openModal}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No booking details available.
          </p>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">
                Refund money to bank account?
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  No
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingDetails;
