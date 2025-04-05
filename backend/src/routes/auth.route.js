import express from "express";

import {
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
  handleContact
} from "../controllers/auth.controller.js";

import { verifyLogin, upload } from "../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/sendOtp", sendOtp);
authRouter.post("/verifyOtp", verifyOtp);
authRouter.post("/logout", logout);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/setNewPassword", setNewPassword);
authRouter.post("/verifyCookie", verifyCookie);
authRouter.get("/get-all-users",getAllUsers);
authRouter.get("/get-user",getUser)
authRouter.put(
  "/update-profile",
  upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 }
  ]),
  updateProfile
);
authRouter.post("/send-subscribe-mail",sendSubscribeMail);
authRouter.post("/handle-contact",handleContact)

export default authRouter;
