import axiosInstance from "./axiosInstance";

export const fetchChatMessages = async (chatId) => {
  try {
    const { data } = await axiosInstance.get(
      `/messages/chat/${chatId}/messages`
    );
    return data.messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const fetchUserCount = async () => {
  try {
    const { data } = await axiosInstance.get("/count");
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

export const fetchDepartmentCount = async () => {
  try {
    const { data } = await axiosInstance.get("/count-departments");
    return data;
  } catch (error) {
    console.error("Error fetching department count:", error);
    throw error;
  }
};

export const fetchCategoryCount = async () => {
  try {
    const { data } = await axiosInstance.get("/count-categories");
    return data;
  } catch (error) {
    console.error("Error fetching category count:", error);
    throw error;
  }
};

// Fetch booking details
export const fetchBookingDetail = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
};

// Update service completion status
export const toggleServiceCompletionStatus = async (
  bookingId,
  serviceId,
  status
) => {
  try {
    await axiosInstance.patch(`/bookings/${bookingId}/service/${serviceId}`, {
      completed: status,
    });
  } catch (error) {
    console.error("Failed to update service completion status:", error);
    throw error;
  }
};

export const fetchBookings = async (page, limit) => {
  try {
    const response = await axiosInstance.get(
      `/bookings?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    throw error;
  }
};

// Fetch all departments
export const fetchDepartments = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/departmentlist?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get(
      `/categoryList`
    );
    return response.data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchChatList = async () => {
  try {
    const response = await axiosInstance.get("/chatList");
    return response.data;
  } catch (error) {
    console.error("Error fetching chat list:", error);
    throw error;
  }
};

export const fetchDepartment = async () => {
  const response = await axiosInstance.get("/departmentlist");
  return response.data;
};

export const fetchCompletedBookings = async () => {
  const response = await axiosInstance.get("/service-Completed");
  return response.data.bookings;
};

export const fetchReportList = async () => {
  const response = await axiosInstance.get("/reports");
  return response.data.reports;
};

export const uploadReport = async (formData) => {
  const response = await axiosInstance.post("/reports/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const editReport = async (reportId, formData) => {
  const response = await axiosInstance.put(`/reports/${reportId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const publishReport = async (reportId) => {
  const response = await axiosInstance.patch(`/reports/${reportId}/publish`, {
    published: true,
  });
  return response.data;
};

export const fetchServices = async () => {
  try {
    const response = await axiosInstance.get(
      `/serviceList`
    );
    const { services } = response.data;
    return Array.isArray(services) ? services : [];
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error; // Propagate the error so it can be handled in the component
  }
};

export const toggleServiceListing = async (id) => {
  try {
    await axiosInstance.patch(`/service/${id}/toggleListing`);
    return true; // Indicate success
  } catch (error) {
    console.error("Error toggling listing status:", error);
    throw error; // Propagate the error to be handled in the component
  }
};

export const fetchUsers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/userlist?page=${page}&limit=${limit}`
    );
    return {
      users: response.data.users,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const toggleUserBlockStatus = async (userId, isBlocked) => {
  try {
    await axiosInstance.patch(`/blockUser/${userId}`, {
      is_blocked: isBlocked,
    });
  } catch (error) {
    console.error("Failed to update user status:", error);
    throw error;
  }
};
