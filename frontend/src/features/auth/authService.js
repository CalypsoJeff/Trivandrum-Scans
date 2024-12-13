// services/authService.js
import axios from "axios";

// const API_URL = "https://trivandrumscans.online/api/users";
const API_URL = "https://trivandrumscans.online/api/users";

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response;
};

const authService = {
  login,
};

export default authService;
