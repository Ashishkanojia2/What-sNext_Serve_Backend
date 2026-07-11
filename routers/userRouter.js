import express from "express";
import {isAuthenticated} from "../middleware/auth.js";
import { profile, updateProfile } from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";

const usersRouter = express.Router();
usersRouter.get("/test", (req, res) => {
  res.json({ success: true, message: "Welcome to User API" });
});

usersRouter.route("/profile").get(isAuthenticated, profile);
// usersRouter
//   .route("/updateProfile")
//   .put(upload.single("avatar"), isAuthenticated, updateProfile);


  usersRouter.route("/updateProfile").put(isAuthenticated,updateProfile);
  // usersRouter
  // .route("/updateProfile")
  // .put(isAuthenticated, upload.single("avatar"), updateProfile);
export default usersRouter;
