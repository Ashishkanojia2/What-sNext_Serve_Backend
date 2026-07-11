import { Query } from "mongoose";
import { orderModal } from "../modals/OrderModal.js";
import { paymentModal } from "../modals/PaymentModal.js";
import {
  errorRes,
  successRes,
  successReSend,
} from "../utils/globalResponseHandler.js";

export const orderPlaced = async (req, res) => {
  try {
    const user = req.user;
    console.log("user in orderPlaced", user);
    if (!user._id)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    // if (
    //   !user.address ||
    //   !user.phone ||
    //   !user.landMark ||
    //   !user.pinCode ||
    //   !user.verified
    // )
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Please update your profile with address, phone, landmark, pincode and verify your account to place order",
    //   });

    const { sellerId, productId, paymentId } = req.body;
    if (sellerId.length == 0 || productId.length == 0 || !paymentId)
      return res.status(400).json({
        success: false,
        message: "SellerId, ProductId and PaymentId are required",
      });

    const order = await orderModal.create({
      userid: user._id,
      sellerId,
      productId,
      paymentId,
      orderStatus: user.orderStatus || "Confirmed",
      paymentMode: user.paymentMode || "Prepaid",
    });

    if (!order)
      return res
        .status(400)
        .json({ success: false, message: "Failed to place order" });
    res
      .status(201)
      .json({ success: true, message: "Order placed successfully", order });

    const addOrderIdToPaymentModal = await paymentModal.findByIdAndUpdate(
      paymentId,
      { orderId: order._id },
    );
    if (!addOrderIdToPaymentModal)
      console.log("Failed to add orderId to payment");
    await addOrderIdToPaymentModal.save();

    user.placedOrders.push(order._id);
    await user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || error });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { userid, type } = req.query;
    // type = "USER" | "SELLER";
    console.log("id", userid);
    if (!userid) return errorRes(res, 400, "Please try again, user id is missing");
    if (type !== "USER" && type !== "SELLER") {
      return errorRes(res, 400, "Please try again, type is missing or invalid");
    }
    let order = [];
    if (type === "USER") {
      order = await orderModal
        .find({ userid: userid })
        .populate("productId", "productName price imageUrl description companyName rating");
      if (!order || order.length === 0) {
        return successRes(res, 200, "No orders found for this user", []);
      }
    } else if (type === "SELLER") {
      order = await orderModal.find({ sellerId: userid });
      if (!order || order.length === 0) {
        return successRes(res, 200, "No orders found at this moment", []);
      }
    }

    console.log("order", order);
    return successReSend(res, 200, "All order Fetch Successfully", order);
  } catch (error) {
    console.log(error);
    errorRes(res, 500, error.message || error);
  }
};
