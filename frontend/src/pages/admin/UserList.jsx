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
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [blockedStatus, setBlockedStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  const loadUsers = async (page) => {
    setStatus("loading");
    try {
      const { users, totalPages } = await fetchUsers(page, 10);
      setUsers(users);
      setTotalPages(totalPages);
      setStatus("succeeded");
    } catch (err) {
      setError(err.message);
      setStatus("failed");
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const initialBlockedStatus = {};
    if (Array.isArray(users)) {
      users.forEach((user) => {
        initialBlockedStatus[user._id] = user.is_blocked;
      });
    }
    setBlockedStatus(initialBlockedStatus);
  }, [users]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);

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
      const isBlocked = !blockedStatus[userToToggle._id];
      try {
        await toggleUserBlockStatus(userToToggle._id, isBlocked);
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-50">
        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between mb-6 space-x-4">
          <div className="flex items-center bg-gray-200 rounded-lg shadow-sm w-full">
            <input
              type="text"
              placeholder="Search users"
              className="px-4 py-2 w-full border-none focus:outline-none bg-transparent rounded-l-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="px-4 py-2 bg-gray-200 border-l border-gray-300">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M9 14a5 5 0 1 1 10 0 5 5 0 0 1-10 0zm0 0v1a1 1 0 0 0 1 1h3m-4-6h4"
                />
              </svg>
            </button>
          </div>
          <select
            className="px-4 py-2 bg-gray-200 rounded-lg shadow-sm"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" ? (
                <tr>
                  <td colSpan="4" className="text-center p-5">
                    Loading...
                  </td>
                </tr>
              ) : status === "failed" ? (
                <tr>
                  <td colSpan="4" className="text-center p-5 text-red-500">
                    {error}
                    <button
                      onClick={() => fetchUsers(currentPage)}
                      className="ml-4 text-blue-500 underline"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isBlocked = blockedStatus[user._id];
                  return (
                    <tr
                      key={user._id}
                      className="bg-white hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.name}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                            isBlocked ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`absolute inset-0 opacity-50 rounded-full ${
                              isBlocked ? "bg-red-200" : "bg-green-200"
                            }`}
                          ></span>
                          <span className="relative">
                            {isBlocked ? "Blocked" : "Active"}
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <Switch
                          onChange={() => openConfirmModal(user)}
                          checked={blockedStatus[user._id] ?? false} // Default to false if undefined
                          onColor="#EF4444"
                          offColor="#A39F74"
                          uncheckedIcon={false}
                          checkedIcon={false}
                          height={20}
                          width={40}
                          borderRadius={10}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-5">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className={`px-4 py-2 rounded ${
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
            className={`px-4 py-2 rounded ${
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
          contentLabel="Confirmation Modal"
          style={modalStyles}
          ariaHideApp={false}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Confirm Action
          </h2>
          <p className="mb-6 text-gray-700">
            Are you sure you want to{" "}
            {blockedStatus[userToToggle?._id] ? "unblock" : "block"} this user?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeConfirmModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmToggleBlockedStatus}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
