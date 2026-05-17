import { orderModal } from "../modals/OrderModal.js";
import { paymentModal } from "../modals/PaymentModal.js";

export const orderPlaced = async (req, res) => {
  try {
    const user = req.user;
    console.log("user in orderPlaced", user);
    if (!user._id)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if (
      !user.address ||
      !user.phone ||
      !user.landMark ||
      !user.pinCode ||
      !user.verified
    )
      return res.status(400).json({
        success: false,
        message:
          "Please update your profile with address, phone, landmark, pincode and verify your account to place order",
      });

    const { sellerId, productId, paymentId } = req.body;
    if (!sellerId || !productId || !paymentId)
      return res.status(400).json({
        success: false,
        message: "SellerId, ProductId and PaymentId are required",
      });

    const order = await orderModal.create({
      userid: user._id,
      sellerId,
      productId,
      paymentId,
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
