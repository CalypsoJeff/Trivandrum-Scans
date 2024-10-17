import React, { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import Sidebar from '../../components/AdminComponents/Sidebar';
import axiosInstance from '../../services/axiosInstance';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [categoryCount, setCatgeoryCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axiosInstance.get('/count');
        setUserCount(response.data);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchDepartmentCount = async () => {
      try {
        const response = await axiosInstance.get('/count-departments');
        setDepartmentCount(response.data);
      } catch (error) {
        console.error('Error fetching department count:', error);
      }
    };

    fetchDepartmentCount();
  }, []);

  useEffect(() => {
    const fetchCategoryCount = async () => {
      try {
        const response = await axiosInstance.get('/count-categories');
        setCatgeoryCount(response.data);
      } catch (error) {
        console.error('Error fetching categories count:', error);
      }
    };

    fetchCategoryCount();
  }, []);

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-700 dark:text-white mb-8">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 flex items-center">
            <FaUsers className="w-12 h-12 text-blue-500 dark:text-blue-400" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-200">Total Users</h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{userCount}</p>
            </div>
          </div>
          
          {/* Total Departments */}
          <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 flex items-center">
            <FaUsers className="w-12 h-12 text-green-500 dark:text-green-400" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-200">Total Departments</h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{departmentCount}</p>
            </div>
          </div>

          {/* Total Categories */}
          <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 flex items-center">
            <FaUsers className="w-12 h-12 text-red-500 dark:text-red-400" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-200">Total Categories</h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{categoryCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
