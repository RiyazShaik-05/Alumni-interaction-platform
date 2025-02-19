import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { logout } from "../../redux/slices/user.slice.js";
import {persistor} from "../../redux/store/store.js"

const ProtectedRoute = ({ showAlert = () => {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.isAuthenticated);

  const verifyUser = async () => {
    if (!isAuthenticated){
      showAlert("Please login!","error");
      return;
    }

    try {
      const response = await axios.post("/api/auth/verifyCookie", {}, { 
        withCredentials: true 
      });

      if (!response?.data.success) {
        showAlert(response?.data?.message || "Session expired. Please log in.", "error");
        dispatch(logout());
        persistor.purge()
        showAlert("Please login","error");
        navigate("/login");
      }
    } catch (error) {
      showAlert("An error occurred. Please try again.", "error");
      dispatch(logout());
      navigate("/login");
    }
  };

  useEffect(() => {
    verifyUser();
  }, [isAuthenticated]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;