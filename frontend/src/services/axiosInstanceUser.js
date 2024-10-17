import axios from "axios";
import Cookies from "js-cookie";
const baseURL = "http://localhost:5000/api/users";
const axiosInstanceUser = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
axiosInstanceUser.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const setupInterceptors = (navigate, dispatch, logoutAction, toast) => {
  axiosInstanceUser.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.error("Response Error:", error.response.data);
      console.error("Status Code:", error.response.status);
      const originalRequest = error.config;
      if (error.response) {
        if (
          error.response.status === 401 &&
          error.response.data.message === "Token expired" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const response = await axios.post(
              `${baseURL}/refreshtoken`,
              {},
              { withCredentials: true }
            );
            const newAccessToken = response.data.accessToken;
            Cookies.set("token", newAccessToken);
            axiosInstanceUser.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstanceUser(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed", refreshError);
            dispatch(logoutAction());
            toast.error("Session expired. Please log in again.");
            navigate("/login");
          }
        }
        if (error.response.status === 403) {
          dispatch(logoutAction());
          toast.error("Your account is blocked. Please contact support.");
          navigate("/login");
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstanceUser;
