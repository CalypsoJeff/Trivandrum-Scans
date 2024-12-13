import axios from "axios";
import axiosInstanceAdmin from "../../api/middlewares/axiosInstanceAdmin";

// const API_URL = "https://trivandrumscans.online/api/admin";
const API_URL = "https://trivandrumscans.online/api/admin";
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
    const response = await axiosInstanceAdmin.post(
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
    const response = await axiosInstanceAdmin.put(
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
