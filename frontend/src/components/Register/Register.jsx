import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { SmallSpinner } from "../index";

function Register({ showAlert }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("student");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showAlert("Password and confirm password do not match", "error");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
        user_type: userType,
      });

      console.log(response);
      // Check if response is successful
      if (response && response.data && !response.data.success) {
        showAlert(response.data?.message || "Something went wrong", "error");
        return;
      }

      showAlert(
        response.data?.message || "Registered successfully! Please Login",
        "success"
      );
      console.log(response);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      // console.error(error);
      // Improved error handling
      showAlert(
        error?.response?.data?.message ||
          "An error occurred. Please try again.",
        "error"
      );
    }
  };

  const handleSendOtp = async (e) => {
    try {
      setLoading((prev) => !prev);
      const response = await axios.post("/api/auth/sendOtp", { email });
      console.log(response.data.message);
      if (!response?.data.success) {
        showAlert(
          response?.data?.message ||
            "Something went wrong! Please try again later",
          "error"
        );
      } else {
        showAlert(
          response?.data?.message || "OTP Sent Successfully",
          "success"
        );

        setOtpSent((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => !prev);
    }
  };

  const handleVerifyOtp = async (e) => {
    try {
      setLoading((prev) => !prev);

      const response = await axios.post("/api/auth/verifyOtp", { email, otp });

      if (!response?.data.success) {
        showAlert(
          response?.data?.message ||
            "Something went wrong! Please try again later",
          "error"
        );

        return;
      }

      showAlert(response?.data?.message || "OTP Verified!", "success");
      setOtpVerified((prev) => !prev);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => !prev);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center font-[sans-serif] h-fit min-h-screen p-4 pt-10 pb-10">
      <div className="max-w-md w-full mx-auto border bg-white border-gray-300 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-gray-800 text-center text-2xl font-bold">
            Register here
          </h2>
        </div>

        <form onSubmit={handleRegister}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="text-gray-800 text-sm mb-2 block"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter Full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-gray-800 text-sm mb-2 block"
              >
                Email Id
              </label>
              <input
                id="email"
                type="text"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className={`text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500 ${
                  otpSent ? "bg-gray-700 cursor-not-allowed" : ""
                }`}
                readOnly={otpSent}
                placeholder="Enter email"
              />
            </div>

            {email && (
              <div className="!mt-8">
                <button
                  onClick={handleSendOtp}
                  type="button"
                  disabled={otpSent}
                  className={`w-full cursor-pointer py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600  ${
                    otpSent
                      ? "bg-blue-950 cursor-not-allowed hover:cursor-not-allowed"
                      : "hover:bg-blue-700 focus:outline-none"
                  }`}
                >
                  {loading ? (
                    <SmallSpinner color="white" />
                  ) : otpSent ? (
                    "OTP sent ✅"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            )}

            {otpSent && (
              <div>
                <label
                  htmlFor="otp"
                  className="text-gray-800 text-sm mb-2 block"
                >
                  OTP
                </label>
                <input
                  id="otp"
                  type="number"
                  readOnly={otpVerified}
                  value={otp}
                  required
                  onChange={(e) => setOtp(e.target.value)}
                  className={`text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500 ${
                    otpVerified ? "bg-gray-700 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter OTP"
                />
              </div>
            )}

            {otp && (
              <div className="!mt-8">
                <button
                  onClick={handleVerifyOtp}
                  type="button"
                  disabled={otpVerified}
                  className={`w-full cursor-pointer py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 ${
                    otpVerified
                      ? "bg-blue-950 cursor-not-allowed hover:cursor-not-allowed"
                      : "hover:bg-blue-700 focus:outline-none"
                  }`}
                >
                  {loading ? (
                    <SmallSpinner color="white" />
                  ) : !otpVerified ? (
                    "Verify OTP"
                  ) : (
                    "OTP Verified ✅"
                  )}
                </button>
              </div>
            )}

            {otpVerified && (
              <div className="relative">
                <label
                  htmlFor="password"
                  className="text-gray-800 text-sm mb-2 block"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Enter password"
                />
                <svg
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000"
                  stroke="#bbb"
                  className="w-4 h-4 absolute right-4 bottom-4 cursor-pointer"
                  viewBox="0 0 128 128"
                >
                  <path
                    d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
            )}

            {password && (
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="text-gray-800 text-sm mb-2 block"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Enter confirm password"
                />
                <svg
                  onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000"
                  stroke="#bbb"
                  className="w-4 h-4 absolute bottom-4 right-4 cursor-pointer"
                  viewBox="0 0 128 128"
                >
                  <path
                    d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
            )}
          </div>

          {name && email && password && confirmPassword && (
            <>
              <div className="mt-2 mb-2">
                <label
                  htmlFor="userType"
                  className="text-gray-800 text-sm mb-2 block"
                >
                  User Type
                </label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full cursor-pointer py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Create an account
                </button>
              </div>
            </>
          )}

          <p className="text-gray-800 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline ml-1"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
