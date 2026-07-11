import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getMyOrders, orderPlaced } from "../controllers/OrderController.js";

const OrderRouter = express.Router();

OrderRouter.route("/placeOrder").post(isAuthenticated, orderPlaced);
// OrderRouter.route("/verify").post(isAuthenticated, verify);
OrderRouter.route("/getMyOrders").get(getMyOrders);

export default OrderRouter;
