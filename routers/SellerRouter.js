import express from "express";
import {isAuthenticated} from "../middleware/auth.js";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  updatePasssword,
  verify,
} from "../controllers/SellerController.js";

const SellerRouter = express.Router();
SellerRouter.get("/test", (req, res) => {
  res.json({ success: true, message: "Welcome to User API" });
});
SellerRouter.route("/register").post(register);
SellerRouter.route("/login").post(login);
SellerRouter.route("/verify").post(isAuthenticated, verify);
SellerRouter.route("/forgotPassword").post(forgotPassword);
SellerRouter.route("/resetPassword").post(resetPassword);
SellerRouter.route("/updatePassword").post(isAuthenticated, updatePasssword);
export default SellerRouter;
