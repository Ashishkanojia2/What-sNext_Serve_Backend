import express from "express";

import {isAuthenticated} from "../middleware/auth.js";
import {
  forgotPassword,
  login,
  register,
  resendOtp,
  resetPassword,
  updatePasssword,
  verify,
} from "../controllers/AuthController.js";

const AuthRouter = express.Router();
AuthRouter.get("/test", (req, res) => {
  res.json({ success: true, message: "Welcome to User API" });
});
AuthRouter.route("/register").post(register);
AuthRouter.route("/login").post(login);
AuthRouter.route("/verify").post(isAuthenticated, verify);
AuthRouter.route("/resendOtp").get(isAuthenticated, resendOtp);
AuthRouter.route("/forgotPassword").post(forgotPassword);
AuthRouter.route("/resetPassword").post(resetPassword);
AuthRouter.route("/updatePassword").post(isAuthenticated, updatePasssword);

export default AuthRouter;
