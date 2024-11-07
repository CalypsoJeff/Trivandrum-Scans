import React, { useState, useEffect } from "react";
import { FaEdit, FaCloudUploadAlt } from "react-icons/fa";
import Modal from "react-modal";
import { toast } from "sonner";
import axiosInstance from "../../services/axiosInstance";
import Sidebar from "../../components/AdminComponents/Sidebar";

Modal.setAppElement("#root");

function ReportList() {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editReportId, setEditReportId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [, setSelectedUserName] = useState("");

  const fetchCompletedBookings = async () => {
    try {
      const response = await axiosInstance.get("/service-Completed");
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Failed to fetch completed bookings:", error);
    }
  };

  const fetchReportList = async () => {
    try {
      const response = await axiosInstance.get("/reports");
      setReports(response.data.reports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  useEffect(() => {
    fetchCompletedBookings();
    fetchReportList();
  }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
    if (!isEdit) {
      let bookingFound = false;
      files.forEach((file) => {
        const fileName = file.name;
        const bookingIdMatch = fileName.match(/(\w{24})(?=\.\w+$)/);

        if (bookingIdMatch && !bookingFound) {
          const extractedBookingId = bookingIdMatch[0];
          const matchedBooking = bookings.find(
            (booking) => booking._id === extractedBookingId
          );

          if (matchedBooking) {
            setSelectedBooking(extractedBookingId);
            setSelectedUserName(matchedBooking.user_id?.name || "");
            bookingFound = true;
          } else {
            toast.error("Booking ID not found among completed bookings.");
            setSelectedBooking("");
            setSelectedUserName("");
          }
        }
      });

      if (!bookingFound) {
        setSelectedBooking("");
        setSelectedUserName("");
        toast.error("No valid booking ID found in filename.");
      }
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    uploadedFiles.forEach((file) => formData.append("report", file));
    formData.append("bookingId", selectedBooking);

    try {
      if (isEdit) {
        await axiosInstance.put(`/reports/${editReportId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Report updated successfully!");
      } else {
        await axiosInstance.post("/reports/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Reports uploaded successfully!");
      }
      setShowModal(false);
      setUploadedFiles([]);
      setSelectedBooking("");
      setSelectedUserName("");
      setIsEdit(false);
      fetchReportList();
    } catch (error) {
      toast.error("Failed to save report.");
      console.error("Error saving report:", error);
    }
  };

  const handleEditClick = (report) => {
    setEditReportId(report._id);
    setSelectedBooking(report.bookingId._id);
    setSelectedUserName(report.bookingId.user_id?.name || "");
    setShowModal(true);
    setIsEdit(true);
  };

  const handlePublishClick = async (reportId) => {
    try {
      await axiosInstance.patch(`/reports/${reportId}/publish`, {
        published: true,
      });
      toast.success("Report published successfully!");
      fetchReportList();
    } catch (error) {
      toast.error("Failed to publish report.");
      console.error("Error publishing report:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-grow p-6">
        <h1 className="text-3xl font-semibold mb-6">Reports</h1>
        <button
          onClick={() => {
            setIsEdit(false);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"
        >
          <FaCloudUploadAlt /> Add Report
        </button>

        {/* Modal for Upload */}
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel={isEdit ? "Edit Report" : "Upload Report"}
          className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-semibold mb-4">
            {isEdit ? "Edit Report" : "Upload Report(s)"}
          </h2>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            className="mb-4"
          />
          <div className="mb-4">
            <label>Select Booking:</label>
            <select
              value={selectedBooking}
              onChange={(e) => setSelectedBooking(e.target.value)}
              className="p-2 border rounded-lg w-full"
            >
              <option value="">Choose a completed booking</option>
              {bookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {booking.user_id?.name} - ID: {booking._id} - Date:{" "}
                  {new Date(booking.booking_date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedBooking}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {isEdit ? "Update" : "Upload"}
            </button>
          </div>
        </Modal>

        {/* Report List Display */}
        <div className="flex flex-col space-y-4 mt-8">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report._id}
                className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between"
              >
                <div className="flex-grow">
                  <p className="text-gray-700">
                    <strong>Report ID:</strong> {report._id}
                  </p>
                  <p className="text-gray-700">
                    <strong>Booking ID:</strong> {report.bookingId._id}
                  </p>
                  <p className="text-gray-700">
                    <strong>User Name:</strong>{" "}
                    {report.bookingId.user_id?.name || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Uploaded On:</strong>{" "}
                    {new Date(report.uploadedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2 overflow-x-auto mt-2">
                    {report.reports.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline whitespace-nowrap"
                      >
                        {file.filename}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(report)}
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handlePublishClick(report._id)}
                    className="bg-green-500 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <FaCloudUploadAlt /> Publish
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No reports found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportList;
