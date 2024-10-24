import axios from "axios";
import axiosInstance from "../../services/axiosInstance";

const API_URL = "http://localhost:5000/api/admin";

const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

const addService = async (serviceData) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/add-service`,
      serviceData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

const updateService = async (serviceData) => {
  try {
    const { id, formData } = serviceData;
    const response = await axiosInstance.put(
      `${API_URL}/update-service/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error.response ? error.response.data : new Error("Server Error");
  }
};

export default { adminLogin, addService, updateService };
