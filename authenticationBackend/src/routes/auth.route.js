import express from "express";

import {
  register,
  login,
  dashboard,
  sendOtp,
  verifyOtp,
  logout,
  forgotPassword,
  setNewPassword,
  verifyCookie,
} from "../controllers/auth.controller.js";

import { verifyLogin } from "../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/dashboard", verifyLogin, dashboard);
authRouter.post("/sendOtp", sendOtp);
authRouter.post("/verifyOtp", verifyOtp);
authRouter.post("/logout", logout);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/setNewPassword", setNewPassword);
authRouter.post("/verifyCookie", verifyCookie);

export default authRouter;
