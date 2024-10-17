import React, { useEffect, useState } from "react"; // Add React import here
import { Navigate,  Outlet,  useNavigate } from "react-router";
import Cookies from "js-cookie";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import { selectUser, clearUser } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../components/UserComponents/Modal'; // Ensure Modal component is correctly imported

const UserPrivateRoutes = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = Cookies.get('token');
    const user = useSelector(selectUser);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const userStatus = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        try {
            const res = await axiosInstanceUser.get(`/getStatus?id=${user.id}`);
            if (res.data.response && res.data.response.is_blocked) {
                setIsBlocked(true);
            }
        } catch (error) {
            console.error('Error checking user status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        userStatus();
    }, [user]);

    const handleModalClose = () => {
        dispatch(clearUser());
        navigate('/login');
    };

    if (!token) {
        return <Navigate to='/login' />;
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
