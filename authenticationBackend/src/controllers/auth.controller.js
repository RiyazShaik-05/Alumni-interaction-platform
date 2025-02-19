import jwt from "jsonwebtoken";
import { pool } from "../db/index.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/nodemailer.js";

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      res.status(404).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(404).json({
        success: false,
        message: "Password and confirm password are not same",
      });
      return;
    }

    const [rows] = await pool.execute(
      "SELECT name FROM users WHERE email = ? ",
      [email]
    );

    //console.log(rows);

    if (rows.length > 0) {
      res.status(409).json({
        success: false,
        message:
          "This email is already registered. Please use a different email or login.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log("hashed password: ",hashedPassword);

    await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    //console.log(response);

    res.status(200).json({
      success: true,
      message: "User registered successfully! Use can Login now!",
    });
    return;
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error,
    });
    return;
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // console.log(email,password);

  try {
    // console.log("Entered try block..");

    if (!email || !password) {
      res.status(401).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    // console.log("Ok we have two fields.")
    // console.log("Fetching existing user...")

    const [existingUser] = await pool.execute(
      "SELECT password FROM users WHERE email = ?",
      [email]
    );

    // console.log("Existing user fetched successfully.")
    // console.log(existingUser);

    if (!existingUser || existingUser?.length === 0) {
      res.status(401).json({
        success: false,
        message:
          "No user is registered with that email. Please Register first.",
      });
      return;
    }

    // console.log("Ok there is one existing user.")

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser[0]?.password || ""
    );

    if (!isPasswordValid) {
      // console.log("password isnt valid. returningggggg")
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // console.log("Password valid...")

    const [user] = await pool.execute(
      "SELECT name,email FROM users WHERE email = ?",
      [email]
    );

    if (!user || user.length === 0) {
      // console.log("No user problem here")
      res.status(400).json({
        success: false,
        message: "Invalid Credentials!",
      });
      return;
    }

    const token = jwt.sign({ email: user[0].email }, process.env.JWT_SECRET);

    // console.log("user found sending data")
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Something happened! Please try again later",
      });
      return;
    }

    // console.log(token);
    res.cookie("token", token);

    res.status(201).json({
      success: true,
      message: "Logged in Successfully!",
      user: user[0],
    });
    return;
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Something happened! Please try again later",
    });
  }
};

const logout = async (req, res) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Login First",
    });
  }
  return res.status(200).clearCookie("token").json({
    success: true,
    message: "Logged out Successfully!",
  });
};

const dashboard = async (req, res) => {
  try {
    // console.log("in dashboard controller middleware part is done");

    // console.log("req      ",req);
    // console.log(req.body);
    const user = req.registeredUser;

    // console.log(user)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched data successfully",
      user: user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something happened! Please try again later",
    });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required!",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP generation Failed!",
      });
    }

    // Calculate local expiration time
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    const localExpirationTime = new Date(
      expirationTime.getTime() - expirationTime.getTimezoneOffset() * 60000
    );

    const formattedLocalExpirationTime = localExpirationTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Check if the email already exists in the otp_verifications table
    const [existingOtp] = await pool.execute(
      "SELECT * FROM otp_verifications WHERE email = ?",
      [email]
    );

    if (existingOtp.length > 0) {
      // If entry exists, update the OTP, expiration time, used status, and created_at time
      await pool.execute(
        "UPDATE otp_verifications SET otp = ?, expiration_time = ?, used = false, created_at = NOW() WHERE email = ?",
        [otp, formattedLocalExpirationTime, email]
      );
    } else {
      // If no entry, insert a new OTP entry
      await pool.execute(
        "INSERT INTO otp_verifications (email, otp, expiration_time) VALUES (?, ?, ?)",
        [email, otp, formattedLocalExpirationTime]
      );
    }

    // Send OTP email
    const customHtml = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .email-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 400px;
          }
          .email-header {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #3f8e2f;
            margin-top: 10px;
            text-align: center;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
            text-align: center;
          }
          .footer a {
            color: #3f8e2f;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            OTP Verification
          </div>
          <p>Hello,</p>
          <p>We received a request to verify your account. Please use the following OTP to complete the verification process:</p>
          <div class="otp-code">
            <strong>${otp}</strong>
          </div>
          <p>If you did not request this, please ignore this email.</p>
          <div class="footer">
            <p>Thank you for choosing our service.</p>
            <p>If you have any questions, please contact our <a href="mailto:connected.eep.project@gmail.com">support team</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await sendEmail(email, "Verification Otp", "", customHtml);

    if (response.accepted.length != 1) {
      return res.status(400).json({
        success: false,
        message: "Unable to send OTP! Please try again later",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong! Please try again later",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const [user] = await pool.execute(
      "SELECT email, expiration_time, used FROM otp_verifications WHERE email = ? AND otp = ?",
      [email, otp]
    );

    if (!user || user.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Invalid OTP! Request a new one",
      });
    }

    const otpData = user[0];

    const currentTime = new Date();
    const expirationTime = new Date(otpData.expiration_time);

    if (currentTime > expirationTime) {
      return res.status(200).json({
        success: false,
        message: "OTP has expired!",
      });
    }

    if (otpData.used) {
      return res.status(200).json({
        success: false,
        message: "OTP has already been used!",
      });
    }

    await pool.execute(
      "UPDATE otp_verifications SET used = TRUE WHERE email = ? AND otp = ?",
      [email, otp]
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "All fields required!",
      });
    }
  
    const [user] = await pool.execute("SELECT name FROM users WHERE email = ?", [
      email,
    ]);
  
    if (!user || user.length != 1) {
      return res.status(200).json({
        success: false,
        message: "Enter registered email!",
      });
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  
    if (!otp) {
      return res.status(200).json({
        success: false,
        message: "OTP generation Failed!",
      });
    }
  
    // Calculate local expiration time
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);
  
    const localExpirationTime = new Date(
      expirationTime.getTime() - expirationTime.getTimezoneOffset() * 60000
    );
  
    const formattedLocalExpirationTime = localExpirationTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  
    // Check if the email already exists in the otp_verifications table
    const [existingOtp] = await pool.execute(
      "SELECT * FROM otp_verifications WHERE email = ?",
      [email]
    );
  
    if (existingOtp.length > 0) {
      // If entry exists, update the OTP, expiration time, used status, and created_at time
      await pool.execute(
        "UPDATE otp_verifications SET otp = ?, expiration_time = ?, used = false, created_at = NOW() WHERE email = ?",
        [otp, formattedLocalExpirationTime, email]
      );
    } else {
      // If no entry, insert a new OTP entry
      await pool.execute(
        "INSERT INTO otp_verifications (email, otp, expiration_time) VALUES (?, ?, ?)",
        [email, otp, formattedLocalExpirationTime]
      );
    }
  
    // Send OTP email
    const customHtml = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .email-container {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              width: 90%;
              max-width: 400px;
            }
            .email-header {
              font-size: 24px;
              color: #333;
              margin-bottom: 20px;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #3f8e2f;
              margin-top: 10px;
              text-align: center;
            }
            .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #777;
              text-align: center;
            }
            .footer a {
              color: #3f8e2f;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              OTP Verification
            </div>
            <p>Hello,</p>
            <p>We received a request to verify your account. Please use the following OTP to complete the verification process:</p>
            <div class="otp-code">
              <strong>${otp}</strong>
            </div>
            <p>If you did not request this, please ignore this email.</p>
            <div class="footer">
              <p>Thank you for choosing our service.</p>
              <p>If you have any questions, please contact our <a href="mailto:connected.eep.project@gmail.com">support team</a>.</p>
            </div>
          </div>
        </body>
        </html>
      `;
  
    const response = await sendEmail(email, "Verification Otp", "", customHtml);
  
    if (response.accepted.length != 1) {
      return res.status(200).json({
        success: false,
        message: "Unable to send OTP! Please try again later",
      });
    }
  
    return res.status(200).json({
      success: true,
      message: "OTP sent!",
    });
  } catch (error) {
    return res.status(400).json({
      success:false,
      message:"Something went wrong! Please try again later"
    })
  }
};

const setNewPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        success: false,
        message: "All fields required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(200).json({
        success: false,
        message: "Password and confirm password doesn't match",
      });
    }

    const [user] = await pool.execute("SELECT email FROM users WHERE email = ?",[email]);

    if(!user || user.length!=1){
      return res.status(200).json({
        success:false,
        message:"Invalid details"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    return res.status(200).json({
      success: true,
      message: "Password updated Sucessfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something happened! Try again later",
    });
  }
};

const verifyCookie = async (req, res) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Please login!",
      });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    const [user] = await pool.execute(
      "SELECT name,email FROM users WHERE email = ?",
      [decoded.email]
    );
  
    if (!user || user.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No user found",
      });
    }
  
    return res.status(200).json({
      success:true,
      message:"Authenticated user"
    })
  } catch (error) {
    return res.status(400).json({
      success:false,
      message:"Something happened! Please try again later"
    })
  }
};

export {
  register,
  login,
  dashboard,
  sendOtp,
  verifyOtp,
  logout,
  forgotPassword,
  setNewPassword,
  verifyCookie
};
