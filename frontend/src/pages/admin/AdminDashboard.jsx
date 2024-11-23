// import React, { useEffect, useState } from "react";
// import { FaUsers } from "react-icons/fa";
// import Sidebar from "../../components/AdminComponents/Sidebar";
// import {
//   fetchCategoryCount,
//   fetchDepartmentCount,
//   fetchUserCount,
// } from "../../services/adminService";
// import ActiveUsersChart from "./ActiveUsersChart";
// import DailyBookingsChart from "../../components/AdminComponents/DailyBookingsChart";
// import ServicePopularityChart from "../../components/AdminComponents/ServicePopularityChart";
// import TimeSlotHeatmap from "../../components/AdminComponents/TimeSlotHeatmap";
// import BookingCancellationsChart from "../../components/AdminComponents/BookingCancellationsChart";
// import RevenueTrendsChart from "../../components/AdminComponents/RevenueTrendsChart";

// const Dashboard = () => {
//   const [userCount, setUserCount] = useState(0);
//   const [departmentCount, setDepartmentCount] = useState(0);
//   const [categoryCount, setCatgeoryCount] = useState(0);

//   useEffect(() => {
//     const loadCounts = async () => {
//       try {
//         const userCount = await fetchUserCount();
//         const departmentCount = await fetchDepartmentCount();
//         const categoryCount = await fetchCategoryCount();
//         setUserCount(userCount);
//         setDepartmentCount(departmentCount);
//         setCatgeoryCount(categoryCount);
//       } catch (error) {
//         console.error("Error fetching counts:", error);
//       }
//     };

//     loadCounts();
//   }, []);

//   return (
//     <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
//       <Sidebar />
//       <div className="flex-1 p-6">
//         <h1 className="text-4xl font-bold text-gray-700 dark:text-white mb-8">
//           Admin Dashboard
//         </h1>

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Total Users */}
//           <div className="bg-gradient-to-r from-blue-500 to-blue-400 shadow-md rounded-lg p-6 flex items-center text-white">
//             <FaUsers className="w-12 h-12" />
//             <div className="ml-4">
//               <h2 className="text-lg font-semibold">Total Users</h2>
//               <p className="text-3xl font-bold">{userCount}</p>
//             </div>
//           </div>

//           {/* Total Departments */}
//           <div className="bg-gradient-to-r from-green-500 to-green-400 shadow-md rounded-lg p-6 flex items-center text-white">
//             <FaUsers className="w-12 h-12" />
//             <div className="ml-4">
//               <h2 className="text-lg font-semibold">Total Departments</h2>
//               <p className="text-3xl font-bold">{departmentCount}</p>
//             </div>
//           </div>

//           {/* Total Categories */}
//           <div className="bg-gradient-to-r from-red-500 to-red-400 shadow-md rounded-lg p-6 flex items-center text-white">
//             <FaUsers className="w-12 h-12" />
//             <div className="ml-4">
//               <h2 className="text-lg font-semibold">Total Categories</h2>
//               <p className="text-3xl font-bold">{categoryCount}</p>
//             </div>
//           </div>
//         </div>

//         {/* Graphs Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
//           {/* Active Users */}
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
//             <ActiveUsersChart />
//           </div>

//           {/* Daily Bookings */}
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
//             <DailyBookingsChart />
//           </div>

//           {/* Service Popularity */}
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
//             <ServicePopularityChart />
//           </div>
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
//             <RevenueTrendsChart />
//           </div>

//           {/* Time Slot Heatmap */}
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
//             <TimeSlotHeatmap />
//           </div>

//           {/* Booking Cancellations */}
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
//             <BookingCancellationsChart />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  FaUsers,
  FaBuilding,
  FaListAlt,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import {
  fetchCategoryCount,
  fetchDepartmentCount,
  fetchUserCount,
} from "../../services/adminService";
import ActiveUsersChart from "./ActiveUsersChart";
import DailyBookingsChart from "../../components/AdminComponents/DailyBookingsChart";
import ServicePopularityChart from "../../components/AdminComponents/ServicePopularityChart";
import TimeSlotHeatmap from "../../components/AdminComponents/TimeSlotHeatmap";
import BookingCancellationsChart from "../../components/AdminComponents/BookingCancellationsChart";
import RevenueTrendsChart from "../../components/AdminComponents/RevenueTrendsChart";
import Sidebar from "../../components/AdminComponents/Sidebar";

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const userCount = await fetchUserCount();
        const departmentCount = await fetchDepartmentCount();
        const categoryCount = await fetchCategoryCount();
        setUserCount(userCount);
        setDepartmentCount(departmentCount);
        setCategoryCount(categoryCount);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    loadCounts();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden lg:block"
        } fixed left-0 top-0 h-full w-64 bg-white shadow-md z-20`}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div
        className="flex-1 flex flex-col overflow-hidden ml-64"
        style={{ marginLeft: "16rem" }}
      >
        <header className="bg-white shadow-md z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="text-gray-500 focus:outline-none focus:text-gray-600 lg:hidden"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />
                  </svg>
                </button>
                <h1 className="text-2xl font-semibold text-gray-900 ml-4">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    <FaSearch />
                  </div>
                </div>
                <button className="ml-4 text-gray-500 focus:outline-none focus:text-gray-600">
                  <FaBell className="h-6 w-6" />
                </button>
                <div className="ml-4 relative">
                  <button className="flex items-center focus:outline-none">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {/* Font Awesome User Icon */}
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-gray-700 h-5 w-5"
                      />
                    </div>
                    <span className="ml-2 text-gray-700">Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-600">
                    Total Users
                  </h2>
                  <FaUsers className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-700">{userCount}</p>
                <p className="text-sm text-gray-500">+2.5% from last month</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-600">
                    Total Departments
                  </h2>
                  <FaBuilding className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-700">
                  {departmentCount}
                </p>
                <p className="text-sm text-gray-500">+1.2% from last month</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-600">
                    Total Categories
                  </h2>
                  <FaListAlt className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-gray-700">
                  {categoryCount}
                </p>
                <p className="text-sm text-gray-500">+0.8% from last month</p>
              </div>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <ActiveUsersChart />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <DailyBookingsChart />
              </div>
            </div>

            <div className="grid gap-6 mb-8 md">
              <div className="bg-white rounded-lg shadow-md p-6">
                <ServicePopularityChart />
              </div>
            </div>
            <div className="grid gap-6 mb-8 md">
              <div className="bg-white rounded-lg shadow-md p-6">
                <RevenueTrendsChart />
              </div>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <TimeSlotHeatmap />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <BookingCancellationsChart />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
