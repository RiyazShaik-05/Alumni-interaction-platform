import cron from "node-cron";
import { pool } from "../db/index.js";


cron.schedule("*/5 * * * *", async () => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM otp_verifications WHERE expiration_time < NOW()"
    );
    // console.log(`Deleted ${result.affectedRows} expired OTP(s)`);
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
});


