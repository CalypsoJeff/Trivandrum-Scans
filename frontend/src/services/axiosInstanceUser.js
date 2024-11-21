// import axios from "axios";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// const baseURL = "http://localhost:5000/api/users";
// const axiosInstanceUser = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// axiosInstanceUser.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// const checkTokenExpiry = (refreshTokenFunc) => {
//   const token = Cookies.get("token");
//   if (!token) return;
//   try {
//     const decoded = jwtDecode(token);
//     const currentTime = Math.floor(Date.now() / 1000);
//     if (decoded.exp - currentTime < 300) {
//       refreshTokenFunc();
//     }
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     refreshTokenFunc();
//   }
// };

// export const startTokenExpiryCheck = (refreshTokenFunc) => {
//   setInterval(() => {
//     checkTokenExpiry(refreshTokenFunc);
//   }, 60000);
// };

// export const setupInterceptors = (navigate, dispatch, logoutAction, toast) => {
//   const refreshToken = async () => {
//     try {
//       const response = await axios.post(
//         `${baseURL}/refreshtoken`,
//         {},
//         { withCredentials: true }
//       );
//       const newAccessToken = response.data.accessToken;
//       Cookies.set("token", newAccessToken);
//       axiosInstanceUser.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
//       console.log(newAccessToken, "New access token generated and saved.");
//     } catch (refreshError) {
//       console.error("Token refresh failed", refreshError);
//       dispatch(logoutAction());
//       toast.error("Session expired. Please log in again.");
//       navigate("/login");
//     }
//   };

//   startTokenExpiryCheck(refreshToken);

//   axiosInstanceUser.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;

//       if (error.response) {
//         const { status, data } = error.response;

//         // Token Expired - Attempt Refresh
//         if (
//           status === 401 &&
//           data.message === "Token expired" &&
//           !originalRequest._retry
//         ) {
//           originalRequest._retry = true;
//           try {
//             const response = await axios.post(
//               `${baseURL}/refreshtoken`,
//               {},
//               {
//                 withCredentials: true,
//               }
//             );
//             const newToken = response.data.accessToken;
//             Cookies.set("token", newToken);

//             // Update Axios Instance with New Token
//             axiosInstanceUser.defaults.headers.Authorization = `Bearer ${newToken}`;
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;

//             // Retry the Original Request
//             return axiosInstanceUser(originalRequest);
//           } catch (refreshError) {
//             console.error("Token refresh failed:", refreshError);
//             logoutAndRedirect();
//           }
//         }

//         // User Blocked
//         if (status === 403) {
//           console.error("User is blocked.");
//           logoutAndRedirect();
//         }
//       }

//       return Promise.reject(error);
//     }
//   );

//   // Helper Function to Logout and Redirect
//   const logoutAndRedirect = () => {
//     Cookies.remove("token");
//     window.location.href = "/login"; // Force full logout
//   };
// };

// export default axiosInstanceUser;




  import axios from "axios";
  import Cookies from "js-cookie";
  import { jwtDecode } from "jwt-decode";

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

  const checkTokenExpiry = (refreshTokenFunc) => {
    const token = Cookies.get("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp - currentTime < 300) {
        refreshTokenFunc();
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      refreshTokenFunc();
    }
  };

  export const startTokenExpiryCheck = (refreshTokenFunc) => {
    setInterval(() => {
      checkTokenExpiry(refreshTokenFunc);
    }, 60000);
  };

  export const setupInterceptors = (navigate, dispatch, logoutAction, toast) => {
    const refreshToken = async () => {
      try {
        const response = await axios.post(
          `${baseURL}/refreshtoken`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = response.data.accessToken;
        Cookies.set("token", newAccessToken);
        axiosInstanceUser.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log(newAccessToken, "New access token generated and saved.");
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        dispatch(logoutAction());
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    };

    startTokenExpiryCheck(refreshToken);

    axiosInstanceUser.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response) {
          if (
            error.response.status === 401 &&
            error.response.data.message === "Token expired" &&
            !originalRequest._retry
          ) {
            originalRequest._retry = true;
            await refreshToken();
            originalRequest.headers.Authorization = `Bearer ${Cookies.get(
              "token"
            )}`;
            return axiosInstanceUser(originalRequest);
          }
          if (error.response.status === 403  ) {
            // console.log('evidana logout povunae');
            
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
