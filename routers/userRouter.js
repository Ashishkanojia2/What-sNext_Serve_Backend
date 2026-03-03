import express, { Router } from "express";
import { register } from "../controllers/userController.js";

const usersRouter = express.Router();

usersRouter.route("/register").post(register);

export default usersRouter; 
