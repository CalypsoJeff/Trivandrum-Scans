// import React from "react";
// import { Navigate, Outlet } from "react-router";
// import Cookies from "js-cookie";

// const UserPrivateRoutes = () => {
//   const token = Cookies.get("token");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   return <Outlet />;
// };

// export default UserPrivateRoutes;

import React, { useEffect, useState } from "react"; 
import { Navigate, Outlet, useNavigate } from "react-router";
import Cookies from "js-cookie";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { selectUser, clearUser } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/UserComponents/Modal";

const UserPrivateRoutes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const user = useSelector(selectUser);
  const [isBlocked, setIsBlocked] = useState(false);
  const [, setIsLoading] = useState(true);

  const userStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await axiosInstanceUser.get(`/getStatus?id=${user.id}`);
      if (response.data.response && response.data.response.is_blocked) {
        console.log(response.data.response || response.data.response.is_blocked,'11111111111111111111111');
        
        setIsBlocked(true);
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userStatus();
  }, [user]);

  const handleModalClose = () => {
    dispatch(clearUser());
    Cookies.remove("token");
    navigate("/login");
  };
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isBlocked) {
    return (
      <Modal
        message="Your account is temporarily blocked"
        onClose={handleModalClose}
      />
    );
  }

  return <Outlet />;
};

export default UserPrivateRoutes;
