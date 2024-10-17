  import React, { useEffect, useState } from "react";
  import axiosInstance from "../../services/axiosInstance";
  import Switch from "react-switch";
  import Modal from "react-modal";
import Sidebar from "../../components/AdminComponents/Sidebar";

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

    const fetchUsers = async (page = 1, limit = 10) => {
      setStatus("loading");
      try {
        const response = await axiosInstance.get(
          `/userlist?page=${page}&limit=${limit}`
        );
        console.log(response);
        
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setStatus("succeeded");
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err.message);
        setStatus("failed");
      }
    };

    useEffect(() => {
      fetchUsers(currentPage);
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

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
      setStatusFilter(e.target.value);
    };

    const openConfirmModal = (user) => {
      setUserToToggle(user);``
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
          await axiosInstance.patch(`/blockUser/${userToToggle._id}`, {
            is_blocked: isBlocked,
          });
          setBlockedStatus((prevState) => ({
            ...prevState,
            [userToToggle._id]: isBlocked,
          }));
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userToToggle._id
                ? { ...user, is_blocked: isBlocked }
                : user
            )
          );
          closeConfirmModal();
        } catch (err) {
          console.error("Failed to update user status:", err);
        }
      }
    };

    const handlePageChange = (newPage) => {
      if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };

    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
        <Sidebar />

        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center bg-white rounded shadow-md">
              <input
                type="text"
                placeholder="Search users"
                className="px-4 py-2 w-64 border-none focus:outline-none"
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
              className="px-4 py-2 bg-gray-200 rounded shadow-md"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-gray-200 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 bg-gray-200 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 bg-gray-200 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 bg-gray-200 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
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
                    </td>
                  </tr>
                ) : Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => {
                    const matchesSearch = user.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                    const matchesStatus =
                      statusFilter === "" || user.status === statusFilter;

                    if (!matchesSearch || !matchesStatus) {
                      return null;
                    }

                    const isBlocked = blockedStatus[user._id];

                    return (
                      <tr key={user._id}>
                        <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                                {user.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                          <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                            {user.email}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                          <span
                            className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                              !isBlocked ? "text-green-900" : "text-red-900"
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`absolute inset-0 opacity-50 rounded-full ${
                                !isBlocked
                                  ? "bg-[#A39F74] dark:bg-[#A39F74]"
                                  : "bg-red-200 dark:bg-red-600"
                              }`}
                            ></span>
                            <span className="relative">
                              {!isBlocked ? "Active" : "Blocked"}
                            </span>
                          </span>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                          <Switch
                            onChange={() => openConfirmModal(user)}
                            checked={isBlocked}
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

          <div className="flex justify-center mt-4">
            <button
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#a39f74] hover:bg-[#c0ba7e]"
              } text-white`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#a39f74] hover:bg-[#c0ba7e]"
              } text-white`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        <Modal
          isOpen={confirmModalIsOpen}
          onRequestClose={closeConfirmModal}
          contentLabel="Confirmation Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
            },
          }}
          ariaHideApp={false}
        >
          <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
          <p className="mb-4">
            Are you sure you want to{" "}
            {blockedStatus[userToToggle?._id] ? "unblock" : "block"} this user?
          </p>
          <div className="flex justify-end">
            <button
              onClick={closeConfirmModal}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={confirmToggleBlockedStatus}
              className="px-4 py-2 mr-2 bg-[#a39f74] text-white rounded hover:bg-[#8e8b6a]"
            >
              Confirm
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  export default UserList;
