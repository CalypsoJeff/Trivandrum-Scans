import axios from "axios";
import Cookies from "js-cookie";

// const axiosInstanceAdmin = axios.create({
//   baseURL: import.meta.env.REACT_APP_API_BASE_URL + "/api/admin",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });
const axiosInstanceAdmin = axios.create({
  // baseURL: "http://localhost:5000/api/admin",
  baseURL: "http://localhost:5000/api/admin",

  
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstanceAdmin.interceptors.request.use(
  (config) => {
    const token = Cookies.get("admintoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstanceAdmin.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access:", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceAdmin;
