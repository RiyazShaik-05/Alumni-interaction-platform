import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../services/nodemailer.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";
import User from "../models/user.model.js";
import OTPVerification from "../models/otpVerifications.model.js";
import mongoose from "mongoose";

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, user_type } = req.body;
    console.log(req.body);

    if (!name || !email || !password || !confirmPassword || !user_type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are not the same",
      });
    }

    // Check if email already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already registered. Please login or use a different email.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in MongoDB
    const newUser = new User({
      full_name: name,
      email,
      password: hashedPassword,
      user_type,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully! You can login now.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists in MongoDB
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message:
          "No user is registered with that email. Please Register first.",
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: existingUser.email, userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // Token expires in 7 days
      }
    );

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Something happened! Please try again later",
      });
    }

    // Remove password from response
    const user = existingUser.toObject();
    delete user.password;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged in Successfully!",
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
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

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("In send otp cotroller");

    // console.log(email)

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required!",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    // console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists! Please login.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5); // OTP valid for 5 mins

    // Check if OTP entry exists
    const existingOtp = await OTPVerification.findOne({ email });

    if (existingOtp) {
      // Update existing OTP record
      await OTPVerification.updateOne(
        { email },
        {
          otp,
          expiration_time: expirationTime,
          used: false,
          createdAt: Date.now(),
        }
      );
    } else {
      // Create new OTP entry
      const data = await OTPVerification.create({
        email,
        otp,
        expiration_time: expirationTime,
      });
      // console.log(data);
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
      </html>`;

    const response = await sendEmail(email, "Verification OTP", "", customHtml);

    if (response.accepted.length !== 1) {
      return res.status(400).json({
        success: false,
        message: "Unable to send OTP! Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again later.",
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

    const otpData = await OTPVerification.findOne({ email, otp });

    if (!otpData) {
      return res.status(200).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    const currentTime = new Date();
    if (currentTime > otpData.expiration_time) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired!",
      });
    }

    if (otpData.used) {
      return res.status(400).json({
        success: false,
        message: "OTP has already been used!",
      });
    }

    await OTPVerification.updateOne({ email, otp }, { used: true });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(req.body);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "All fields required!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Enter registered email!",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5); // OTP expires in 5 minutes

    // Check if the OTP entry already exists for the user
    const existingOtp = await OTPVerification.findOne({ email });

    if (existingOtp) {
      // Update existing OTP entry
      existingOtp.otp = otp;
      existingOtp.expiration_time = expirationTime;
      existingOtp.used = false;
      await existingOtp.save();
    } else {
      // Create a new OTP entry
      await OTPVerification.create({
        email,
        otp,
        expiration_time: expirationTime,
        used: false,
      });
    }

    // Send OTP email
    const customHtml = `
      <html>
        <head>
          <title>OTP Verification</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; }
            .email-container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .otp-code { font-size: 36px; font-weight: bold; color: #3f8e2f; text-align: center; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2>OTP Verification</h2>
            <p>Hello,</p>
            <p>Use the following OTP to verify your account:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for 5 minutes. If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      </html>`;

    const response = await sendEmail(email, "Verification OTP", "", customHtml);

    if (!response || response.accepted.length !== 1) {
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
    console.error("Forgot Password Error:", error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong! Please try again later",
    });
  }
};

const setNewPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid details!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error("Set New Password Error:", error);
    return res.status(400).json({
      success: false,
      message: "Something happened! Try again later.",
    });
  }
};

const verifyCookie = async (req, res) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne(
      { email: decoded.email },
      "full_name email"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authenticated user",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token or session expired",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      email,
      full_name,
      college_name,
      branch,
      roll_number,
      github_link,
      linkedin_link,
      domains,
    } = req.body;

    let profilePicUrl = req.body.profile_pic || null;
    let coverPhotoUrl = req.body.cover_photo || null;

    // Upload profile picture if provided
    if (req.files?.profile_pic) {
      const localFilePath = req.files.profile_pic[0].path;
      const uploadResult = await uploadOnCloudinary(localFilePath);
      profilePicUrl = uploadResult.secure_url;
    }

    // Upload cover photo if provided
    if (req.files?.cover_photo) {
      const localFilePath = req.files.cover_photo[0].path;
      const uploadResult = await uploadOnCloudinary(localFilePath);
      coverPhotoUrl = uploadResult.secure_url;
    }

    // Convert domains array if provided
    const updateFields = {};
    if (full_name) updateFields.full_name = full_name;
    if (college_name) updateFields.college_name = college_name;
    if (branch) updateFields.branch = branch;
    if (roll_number) updateFields.roll_number = roll_number;
    if (github_link) updateFields.github_link = github_link;
    if (linkedin_link) updateFields.linkedin_link = linkedin_link;
    if (domains) updateFields.domains = domains;
    if (profilePicUrl) updateFields.profile_pic = profilePicUrl;
    if (coverPhotoUrl) updateFields.cover_photo = coverPhotoUrl;

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields provided for update" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true, projection: { password: 0 } }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const sendSubscribeMail = async (req, res) => {
  try {
    const { email } = req.body;

    const customHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thank You for Subscribing!</title>
    <style>
      /* General styling for the email */
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      }
      .email-container {
        width: 100%;
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
      }
      .header {
        background-color: #007BFF;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .content {
        padding: 20px;
        color: #333333;
        line-height: 1.6;
      }
      .content p {
        margin: 0 0 15px;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007BFF;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 10px;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 10px;
        text-align: center;
        font-size: 12px;
        color: #777777;
      }
      .footer a {
        color: #007BFF;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <!-- Main email container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 10px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-container">
            <!-- Header -->
            <tr>
              <td class="header">
                <h1>Thank You for Subscribing!</h1>
              </td>
            </tr>
            <tr>
              <td class="content">
                <p>Hi there,</p>
                <p>
                  Thanks for subscribing to our newsletter. We're thrilled to have you on board!
                  Expect to receive updates on our latest news, exclusive offers, and insightful tips.
                </p>
                <p>
                  If you have any questions or feedback, feel free to reply to this email. We’re here to help!
                </p>
                <p>
                </p>
                <p>
                  Best regards,<br />
                  The connectEd Team
                </p>
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p>
                  You received this email because you subscribed to our newsletter.
                </p>
                <p>
                  connectEd | Nambur
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

    const response = await sendEmail(
      email,
      "Thanks for Subscribing!",
      "",
      customHtml
    );
    // console.log(response.accepted.length);

    if (response.accepted.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Error sending mail",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { name } = req.query;

    console.log(name);
    if (!name) {
      return res.status(400).json({
        succcess: false,
        message: "Name is required",
      });
    }

    const users = await User.find(
      { full_name: { $regex: `^${name}`, $options: "i" } },
      { full_name: 1, profile_pic: 1 }
    ).limit(10);

    return res.status(201).json({
      success: true,
      message: "Fetched users successfully!",
      users,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.query;

  // console.log(req.query)

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "No ID provided!",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID !",
    });
  }

  try {
    const user = await User.findById(id, { password: 0 });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched user successfully!",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const handleContact = async (req, res) => {
  const { email, name, message } = req.body;

  if (!email || !name || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields required!",
    });
  }

  try {
    const customHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thank You for Contacting Us!</title>
    <style>
      /* General styling for the email */
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      }
      .email-container {
        width: 100%;
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
      }
      .header {
        background-color: #007BFF;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .content {
        padding: 20px;
        color: #333333;
        line-height: 1.6;
      }
      .content p {
        margin: 0 0 15px;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 10px;
        text-align: center;
        font-size: 12px;
        color: #777777;
      }
      .footer a {
        color: #007BFF;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <!-- Main email container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 10px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-container">
            <!-- Header -->
            <tr>
              <td class="header">
                <h1>Thank You for Contacting Us, ${name}!</h1>
              </td>
            </tr>
            <tr>
              <td class="content">
                <p>Hi ${name},</p>
                <p>
                  Thank you for reaching out to us! We appreciate your message and will get back to you as soon as possible.
                </p>
                <p>
                  If your inquiry is urgent, please feel free to reply to this email, and we'll prioritize your request.
                </p>
                <p>
                  In the meantime, you can explore our website for more information.
                </p>
                <p>
                  Best regards,<br />
                  The connectEd Team
                </p>
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p>
                  You received this email because you contacted us.
                </p>
                <p>
                  connectEd | Nambur
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;
    const response = await sendEmail(
      email,
      "Thanks for Contacting us.",
      "",
      customHtml
    );

    if (response.accepted.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Error sending mail!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email sent Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server Error!",
    });
  }
};

export {
  register,
  login,
  sendOtp,
  verifyOtp,
  logout,
  forgotPassword,
  setNewPassword,
  verifyCookie,
  updateProfile,
  sendSubscribeMail,
  getAllUsers,
  getUser,
  handleContact,
};
