/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import Modal from "react-modal";
import Sidebar from "../../components/AdminComponents/Sidebar";
import { fetchUsers, toggleUserBlockStatus } from "../../services/adminService";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    width: "90%",
    maxWidth: "450px",
    padding: "30px 25px",
    borderRadius: "12px",
    backgroundColor: "#fefefe",
    border: "none",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [blockedStatus, setBlockedStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  // Load users and initialize blocked status
  useEffect(() => {
    const initializeBlockedStatus = (users) => {
      const statusMap = {};
      users.forEach((user) => {
        statusMap[user._id] = user.is_blocked;
      });
      setBlockedStatus(statusMap);
    };

    const loadData = async () => {
      setStatus("loading");
      try {
        const { users, totalPages } = await fetchUsers(currentPage, rowsPerPage);
        setUsers(users);
        setFilteredUsers(users); // Initialize filtered users
        setTotalPages(totalPages);
        initializeBlockedStatus(users);
        setStatus("succeeded");
      } catch (err) {
        setError(err.message);
        setStatus("failed");
      }
    };

    loadData();
  }, [currentPage, rowsPerPage]);

  // Filter users by search term and status
  useEffect(() => {
    const filterData = () => {
      let updatedUsers = [...users];

      if (searchTerm) {
        updatedUsers = updatedUsers.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter) {
        const isBlockedFilter = statusFilter === "Blocked";
        updatedUsers = updatedUsers.filter(
          (user) => user.is_blocked === isBlockedFilter
        );
      }

      setFilteredUsers(updatedUsers);
    };

    filterData();
  }, [searchTerm, statusFilter, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const openConfirmModal = (user) => {
    setUserToToggle(user);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
    setUserToToggle(null);
  };

  const confirmToggleBlockedStatus = async () => {
    if (userToToggle) {
      const isBlocked = !blockedStatus[userToToggle._id]; // Toggle the current status
      try {
        await toggleUserBlockStatus(userToToggle._id, isBlocked); // Call the API
        setBlockedStatus((prev) => ({
          ...prev,
          [userToToggle._id]: isBlocked,
        }));
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userToToggle._id ? { ...u, is_blocked: isBlocked } : u
          )
        );
        closeConfirmModal();
      } catch (err) {
        console.error("Failed to update user status:", err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your platform users.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search users by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            className="px-4 py-2 bg-gray-200 rounded-lg shadow-sm"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        {/* Rows Per Page Selector */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold mr-2">
            Rows per page:
          </label>
          <select
            className="px-4 py-2 border rounded-lg shadow-sm"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {status === "loading" ? (
                <tr>
                  <td colSpan="4" className="text-center px-6 py-4">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 text-sm rounded-lg ${
                          blockedStatus[user._id]
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {blockedStatus[user._id] ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Switch
                        onChange={() => openConfirmModal(user)}
                        checked={blockedStatus[user._id] ?? false}
                        onColor="#EF4444"
                        offColor="#A3A3A3"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={20}
                        width={40}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-6 py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Confirmation Modal */}
        <Modal
          isOpen={confirmModalIsOpen}
          onRequestClose={closeConfirmModal}
          contentLabel="Confirm Action"
          style={modalStyles}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Confirm Action
          </h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to{" "}
            <span className="font-bold">
              {blockedStatus[userToToggle?._id] ? "unblock" : "block"}
            </span>{" "}
            this user?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeConfirmModal}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmToggleBlockedStatus}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Confirm
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default UserList;
