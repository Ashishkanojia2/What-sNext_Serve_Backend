import express, { Router } from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verify,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const usersRouter = express.Router();
usersRouter.get("/test", (req, res) => {
  res.json({ success: true, message: "Welcome to User API" });
});
usersRouter.route("/register").post(register);
usersRouter.route("/login").post(login);
usersRouter.route("/verify").post(isAuthenticated, verify);
usersRouter.route("/forgotPassword").post(forgotPassword);
usersRouter.route("/resetPassword").post(resetPassword);

export default usersRouter;
