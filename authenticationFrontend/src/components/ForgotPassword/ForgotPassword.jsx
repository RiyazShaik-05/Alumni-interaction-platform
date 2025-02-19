import React, { useState } from "react";
import { SmallSpinner } from "../index";
import axios from "axios";

function ForgotPassword({showAlert = ()=>{}}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState("");
  const [otpVerified, setOtpVerified] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = () => {};

  const handleSendOtp = async () => {
    try {
      setLoading(prev=>!prev);
      if(!email){
        showAlert("Email required!","error");
      }else{
        const response = await axios.post("/api/auth/forgotPassword",{email});
        if(!response?.data?.success){
          showAlert(response?.data?.message || "Error sending OTP","error");
        }
        showAlert(response?.data?.message || "OTP sent successfully","success");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev=>!prev)
    }
  };

  const handleVerifyOtp = () => {};

  return (
    <>
      <div className="min-h-screen border-x-lime-400 bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto border bg-white border-gray-300 rounded-2xl p-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-10">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
              Forgot your password?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email and reset here after verification.
            </p>
          </div>
          <form onSubmit={handleResetPassword}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="text-gray-800 text-sm mb-2 block"
                >
                  Email Id
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Enter email"
                />
              </div>

              {email && (
                <div className="!mt-8">
                  <button
                    onClick={handleSendOtp}
                    type="button"
                    className="w-full cursor-pointer py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
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
                    value={otp}
                    required
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                    placeholder="Enter OTP"
                  />
                </div>
              )}

              {otp && (
                <div className="!mt-8">
                  <button
                    onClick={handleVerifyOtp}
                    type="button"
                    className="w-full cursor-pointer py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
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

            {email && password && confirmPassword && (
              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full cursor-pointer py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Reset Password
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
