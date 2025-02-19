import React, { useState } from "react";
import { logout } from "../../redux/slices/user.slice.js";
import { useDispatch } from "react-redux";
import { persistor } from "../../redux/store/store.js";
import { useNavigate } from "react-router-dom";
import { SmallSpinner } from "../index.js";
import axios from "axios";

function Logout({ showAlert = () => {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/logout", {
        withCredentials: true,
      });
      if (!response?.data?.success) {
        showAlert(response?.data?.message || "Logout Failed", "error");
      } else {
        dispatch(logout());
        await persistor.purge();
        showAlert("Logged out Successfully!", "success");
        navigate("/login");
      }
    } catch (error) {
      showAlert("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="!mt-8">
      <button
        onClick={handleLogout}
        disabled={loading}
        type="button"
        className={`w-full cursor-pointer py-3 px-4 text-sm tracking-wider font-semibold rounded-md ${
          loading ? "bg-gray-500" : "bg-blue-600"
        } text-white hover:bg-blue-700 focus:outline-none`}
      >
        {loading ? <SmallSpinner color="white" /> : "Logout"}
      </button>
    </div>
  );
}

export default Logout;
