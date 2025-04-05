import React, { useEffect, useState, useCallback } from "react";
import {
  Register,
  Login,
  Popup,
  Dashboard,
  ProtectedRoute,
  NotFound,
  Home,
  ForgotPassword,
  UpdateStudentProfile,
  Loader,
  Jobs,
  Events,
  LoggedInHome,
  About,
  Services,
  Contact,
  SearchUsers,
  Profile
} from "./components";

import Layout from "../src/pages/Layout.jsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

import { logout } from "./redux/slices/user.slice.js";

import { persistor } from "./redux/store/store.js";

const RedirectWithAlert = ({ message, type, navigateTo, showAlert }) => {
  const navigate = useNavigate();

  useEffect(() => {
    showAlert(message, type);
    navigate(navigateTo);
  }, [message, type, showAlert]);

  return null;
};

const App = () => {
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const first = useSelector((state) => state.first);
  const dispatch = useDispatch();

  const showAlert = useCallback((message, type, duration = 3000) => {
    setAlert({ message, type, duration });
    setTimeout(() => setAlert(null), duration);
  }, []);

  const checkVerification = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/auth/verifyCookie",
        {},
        { withCredentials: true }
      );
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
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout showAlert={showAlert} />}>
          <Route
            index
            element={!isAuthenticated ? <Home /> : <LoggedInHome />}
          />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact showAlert={showAlert} />} />

          <Route
            path="login"
            element={
              isAuthenticated ? (
                <RedirectWithAlert
                  message={!first ? "Logged in successfully" : "Logout First"}
                  type={!first ? "success" : "error"}
                  navigateTo="/dashboard"
                  showAlert={showAlert}
                />
              ) : (
                <Login showAlert={showAlert} />
              )
            }
          />

          <Route path="register" element={<Register showAlert={showAlert} />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute showAlert={showAlert} />}>
            <Route
              path="dashboard"
              element={<Dashboard showAlert={showAlert} />}
            />
          </Route>

          <Route element={<ProtectedRoute showAlert={showAlert} />}>
            <Route path="jobs" element={<Jobs showAlert={showAlert} />} />
          </Route>

          <Route element={<ProtectedRoute showAlert={showAlert} />}>
            <Route path="events" element={<Events showAlert={showAlert} />} />
          </Route>

          <Route element={<ProtectedRoute showAlert={showAlert} />}>
            <Route path="search-users" element={<SearchUsers showAlert={showAlert} />} />
          </Route>

          <Route element={<ProtectedRoute showAlert={showAlert} />}>
            <Route path="update-profile" element={<UpdateStudentProfile showAlert={showAlert} />} />
          </Route>

          <Route element={<ProtectedRoute showAlert={showAlert} />}>
            <Route path="profile/:id" element={<Profile showAlert={showAlert} />} />
          </Route>

          <Route
            path="forgot-password"
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
        </Route>
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
