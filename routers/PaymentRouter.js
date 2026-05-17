import express from "express";
import isAuthenticated from "../middleware/auth.js";
import { paymentCreate } from "../controllers/PaymentController.js";

const PaymentRouter = express.Router();

PaymentRouter.route("/paymentCreate").post(isAuthenticated, paymentCreate);
// PaymentRouter.route("/verify").post(isAuthenticated, verify);

export default PaymentRouter;