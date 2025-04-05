import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures one OTP per email at a time
  },
  otp: {
    type: String,
    required: true,
  },
  expiration_time: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false, // Default to not used
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically set timestamp
  },
});

const OtpVerification = mongoose.model("OtpVerification", otpVerificationSchema);

export default OtpVerification;
