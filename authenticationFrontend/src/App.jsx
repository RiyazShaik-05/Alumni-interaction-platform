import React, { useEffect, useState, useCallback } from "react";
import {
  Register,
  Login,
  Popup,
  Dashboard,
  ProtectedRoute,
  NotFound,
  Home,
  ForgotPassword
} from "./components";

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

import { logout } from "./redux/slices/user.slice.js"; 

import { persistor } from "./redux/store/store.js";

const RedirectWithAlert = ({ message, type, navigateTo, showAlert }) => {
  const navigate = useNavigate();

  useEffect(() => {
    showAlert(message, type);
    navigate(navigateTo);
  }, [message, type,showAlert]);

  return null;
};

const App = () => {
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();

  const showAlert = useCallback((message, type, duration = 3000) => {
    setAlert({ message, type, duration });
    setTimeout(() => setAlert(null), duration);
  }, []);
  

  const checkVerification = useCallback(async () => {
    try {
      const response = await axios.post("/api/auth/verifyCookie", {}, { withCredentials: true });
      if (!response.data.success) {
        dispatch(logout());
        persistor.purge();
      }
    } catch (error) {
      console.error("Verification Error:", error);
      dispatch(logout());
      persistor.purge();
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    checkVerification();
  }, [checkVerification]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <RedirectWithAlert
                message="Logout First"
                type="error"
                navigateTo="/dashboard"
                showAlert={showAlert}
              />
            ) : (
              <Login showAlert={showAlert} />
            )
          }
        />

        <Route
          path="/register"
          element={<Register showAlert={showAlert} />}
        />

        <Route element={<ProtectedRoute showAlert={showAlert} />}>
          <Route path="/dashboard" element={<Dashboard showAlert={showAlert} />} />
        </Route>

        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <RedirectWithAlert
                message="Logout First!"
                type="error"
                navigateTo="/dashboard"
                showAlert={showAlert}
              />
            ) : (
              <ForgotPassword showAlert={showAlert} />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {alert && (
        <Popup
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </Router>
  );
};

export default App;