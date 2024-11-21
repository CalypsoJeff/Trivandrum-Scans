/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaEdit, FaCloudUploadAlt } from "react-icons/fa";
import Modal from "react-modal";
import { toast } from "sonner";
import Sidebar from "../../components/AdminComponents/Sidebar";
import {
  editReport,
  fetchCompletedBookings,
  fetchReportList,
  publishReport,
  uploadReport,
} from "../../services/adminService";

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Function to reset modal state
  const resetModalState = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditReportId(null);
    setUploadedFiles([]);
    setSelectedBooking("");
    setSelectedUserName("");
  };

  const loadBookings = async () => {
    try {
      const bookingsData = await fetchCompletedBookings();
      setBookings(bookingsData);
    } catch (error) {
      toast.error("Failed to fetch completed bookings");
    }
  };

  const loadReports = async () => {
    try {
      const reportsData = await fetchReportList();
      setReports(reportsData);
    } catch (error) {
      toast.error("Failed to fetch reports");
    }
  };

  useEffect(() => {
    loadBookings();
    loadReports();
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
        await editReport(editReportId, formData);
        toast.success("Report updated successfully!");
      } else {
        await uploadReport(formData);
        toast.success("Reports uploaded successfully!");
      }
      resetModalState();
      loadReports();
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
      await publishReport(reportId);
      toast.success("Report published successfully!");
      loadReports();
    } catch (error) {
      toast.error("Failed to publish report.");
      console.error("Error publishing report:", error);
    }
  };

  // Search Logic
  const filteredReports = reports.filter((report) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      report._id.toLowerCase().includes(searchLower) ||
      report.bookingId._id.toLowerCase().includes(searchLower) ||
      (report.bookingId.user_id?.name || "")
        .toLowerCase()
        .includes(searchLower) ||
      new Date(report.uploadedAt)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchLower)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-grow p-6">
        <h1 className="text-3xl font-semibold mb-6">Reports</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setIsEdit(false);
              setShowModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaCloudUploadAlt /> Add Report
          </button>
          <input
            type="text"
            placeholder="Search by user name, report ID, booking ID, or date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-lg w-1/3"
          />
        </div>

        {/* Modal for Upload */}
        <Modal
          isOpen={showModal}
          onRequestClose={resetModalState}
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
              onClick={resetModalState}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {paginatedReports.length > 0 ? (
            paginatedReports.map((report) => (
              <div
                key={report._id}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between"
              >
                <div>
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
                  <div className="flex flex-col mt-4 space-y-2">
                    <strong className="text-gray-800">Files:</strong>
                    {report.reports.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {file.filename}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  {!report.published && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-2">
              No reports found.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportList;
