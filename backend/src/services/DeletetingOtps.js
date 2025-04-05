import cron from "node-cron";
import OtpVerification from "../models/otpVerifications.model.js";

cron.schedule("*/5 * * * *", async () => {
  try {
    const result = await OtpVerification.deleteMany({
      expiration_time: { $lt: new Date() },
    });

    // console.log(`Deleted ${result.deletedCount} expired OTP(s)`);
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
});
