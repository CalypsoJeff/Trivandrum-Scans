/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../services/axiosInstance";
import Sidebar from "../../components/AdminComponents/Sidebar";
import {
  fetchBookingDetail,
  toggleServiceCompletionStatus,
} from "../../services/adminService";

function BookingDetail() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookingData = async () => {
    try {
      const data = await fetchBookingDetail(bookingId);
      setBooking(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch booking details");
      setLoading(false);
    }
  };
  const toggleServiceCompletion = async (serviceId, currentStatus) => {
    try {
      const updatedServiceStatus = !currentStatus;
      await toggleServiceCompletionStatus(
        bookingId,
        serviceId,
        updatedServiceStatus
      );

      setBooking((prevBooking) => ({
        ...prevBooking,
        services: prevBooking.services.map((service) =>
          service.service_id?._id === serviceId
            ? { ...service, completed: updatedServiceStatus }
            : service
        ),
      }));

      toast.success(
        `Service marked as ${updatedServiceStatus ? "completed" : "incomplete"}`
      );
    } catch (error) {
      console.error("Failed to update service completion status:", error);
      toast.error("Failed to update the service status. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

  if (loading) {
    return <p className="text-center mt-10">Loading booking details...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!booking) {
    return (
      <p className="text-center text-gray-500">No booking details available</p>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Booking Details
        </h1>

        {/* Booking and User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Booking User Information
            </h2>
            <p className="text-gray-600">
              <strong>Name:</strong> {booking.user_id?.name || "Unknown User"}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong>{" "}
              {booking.user_id?.email || "Not Available"}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Booking Information
            </h2>
            <p className="text-gray-600">
              <strong>Booking Date:</strong>{" "}
              {new Date(booking.booking_date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <strong>Booking Time Slot:</strong> {booking.booking_time_slot}
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

        {/* Services and Persons */}
        <div className="bg-gray-50 p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center border-b pb-4">
            Booked Services
          </h2>
          {booking.services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {booking.services.map((service, index) => (
                <div
                  key={service.service_id?._id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Service {index + 1}:{" "}
                    {service.service_id?.name || "Unknown Service"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    <strong>Price:</strong> ₹{service.service_id?.price} x{" "}
                    {service.persons.length} person(s) = ₹
                    {service.service_id?.price * service.persons.length}
                  </p>
                  <h4 className="font-semibold text-md text-gray-700 mb-2">
                    Persons:
                  </h4>
                  {service.persons.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      {service.persons.map((person) => (
                        <li key={person._id} className="text-gray-700">
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

                  {/* Toggle Completion Status */}
                  <div className="mt-4 flex items-center">
                    <label className="text-gray-700 mr-2 font-semibold">
                      Test Completed:
                    </label>
                    <input
                      type="checkbox"
                      checked={service.completed || false}
                      onChange={() =>
                        toggleServiceCompletion(
                          service.service_id?._id,
                          service.completed
                        )
                      }
                      className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">
              No services available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;
