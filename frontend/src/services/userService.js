/* eslint-disable no-unused-vars */
import axiosInstanceUser from "../api/middlewares/axiosInstanceUser";
import { toast } from "sonner";
import axios from "axios";
import axiosInstanceAdmin from "../api/middlewares/axiosInstanceAdmin";

// Clear user's cart in backend after booking confirmation
export const clearCartInBackend = async (userId) => {
  try {
    const response = await axiosInstanceUser.post(`/cart/clear`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

// Initiate chat and send initial confirmation message to the user
export const initiateChatWithAdmin = async (userId, service, date) => {
  try {
    const { data } = await axiosInstanceUser.post(`/messages/chat/start`, {
      userId,
    });
    await axiosInstanceAdmin.post(`/chat/${data.chatId}/send`, {
      content: `Your booking for ${service} on ${date} has been confirmed. Thank you!`,
    });
    return data;
  } catch (error) {
    console.error("Error initiating chat:", error);
    throw error;
  }
};

// Confirm booking
export const confirmBooking = async (params) => {
  try {
    const response = await axiosInstanceUser.post("/confirm-booking", {
      sessionId: params.sessionId,
      userId: params.userId,
      appointmentDate: params.appointmentDate,
      services: params.services,
      amount: params.amount,
      appointmentTimeSlot: params.appointmentTimeSlot,
    });
    return response.data;
  } catch (error) {
    console.error("Error confirming booking:", error);
    throw error;
  }
};

// Fetch booking details by ID
export const fetchBookingDetails = async (id) => {
  try {
    const response = await axiosInstanceUser.get(`/booking/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw new Error("Failed to fetch booking details");
  }
};

// Fetch reports for a booking by booking ID
export const fetchReports = async (id) => {
  try {
    const response = await axiosInstanceUser.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    toast.error("Failed to fetch reports for this booking.");
    throw error;
  }
};

// Cancel a booking by booking ID
export const cancelBooking = async (id) => {
  try {
    const response = await axiosInstanceUser.post(`/booking/cancel/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    toast.error("Failed to cancel the booking.");
    throw error;
  }
};

export const fetchUserBookings = async (userId) => {
  try {
    const response = await axiosInstanceUser.get(`/bookings/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
};

// Fetch the latest cart data for a user
export const fetchLatestCart = async (userId) => {
  try {
    const response = await axiosInstanceUser.get(`/cart/latest/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cart data:", error);
    throw error;
  }
};

// Create a new booking and initiate Stripe checkout session
export const createBookingSession = async (bookingData) => {
  try {
    const response = await axiosInstanceUser.post(
      "/booknowcheckout",
      bookingData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating booking and Stripe session:", error);
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      "https://trivandrum-scans.onrender.com/api/users/forget-password",
      { email }
    );
    return response;
  } catch (error) {
    console.error("Error in password reset request:", error);
    throw error;
  }
};

export const fetchServices = async (page, limit) => {
  try {
    const response = await axiosInstanceUser.get("/serviceList", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch services"
    );
  }
};

export const addServiceToCart = async (cartData) => {
  try {
    const response = await axiosInstanceUser.post("/cart", cartData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add service to cart");
  }
};

export const otpVerification = async (otp, email) => {
  const response = await axios.post(
    "https://trivandrum-scans.onrender.com/api/users/otp-verification",
    {
      otp,
      email,
    }
  );
  console.log(response.data, "service resp0onse");

  return response.data;
};

export const resendOtp = async (email) => {
  const response = await axios.post(
    "https://trivandrum-scans.onrender.com/api/users/resend-otp",

    { email }
  );
  return response.data;
};

// Fetch user data by user ID
export const fetchUserData = async (userId) => {
  const response = await axiosInstanceUser.get(`/UserData/${userId}`);
  return response.data;
};

// Fetch family members of the user
export const fetchFamilyData = async (userId) => {
  if (!userId) {
    console.log("no user id");
  }
  const response = await axiosInstanceUser.get(`/familyData/${userId}`);
  return response.data;
};

// Update specific user data field
export const updateUserDataField = async (userId, field, updatedValue) => {
  const response = await axiosInstanceUser.put(`/UserData/edit/${userId}`, {
    fieldToChange: { [field]: updatedValue },
  });
  return response.data;
};

// Add new family member to the user's family list
export const addFamilyMember = async (familyMemberData, userId) => {
  const response = await axiosInstanceUser.post(`/patients/add`, {
    ...familyMemberData,
    userId,
  });
  return response.data;
};

// Fetch published reports for a specific user
export const fetchUserReports = async (userId) => {
  const response = await axiosInstanceUser.get(`/reports/${userId}`);
  return response.data.filter((report) => report.published); // Return only published reports
};

export const fetchServiceDetail = async (serviceId) => {
  const response = await axiosInstanceUser.get(`/service/${serviceId}`);
  return response.data;
};

// Fetch list of categories
export const fetchCategories = async () => {
  const response = await axiosInstanceUser.get("/categoryList");
  console.log(response.data,'##############');
  
  return response.data.categories;
};

// Fetch chat ID for a user
export const getChatId = async (userId) => {
  const response = await axiosInstanceUser.get(
    `/messages/chat/start/${userId}`
  );
  return response.data.chat._id;
};

// Fetch initial messages for a chat
export const fetchMessages = async (chatId) => {
  const response = await axiosInstanceUser.get(
    `/messages/chat/${chatId}/messages`
  );
  return response.data.messages;
};
