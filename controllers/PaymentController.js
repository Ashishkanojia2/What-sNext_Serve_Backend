import { paymentModal } from "../modals/PaymentModal.js";

export const paymentCreate = async (req, res) => {
  try {
    const user = req.user;
    if (!user._id)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const { status, method, amount, paid } = req.body;
    if (!status || !method || !amount || !paid)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const payment = await paymentModal.create({
      status,
      method,
      amount,
      paidAt: Date.now(),
      paid,
      userid: user._id,
    });

    if (!payment)
      return res
        .status(400)
        .json({ success: false, message: "Failed to create payment" });
    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || error });
  }
};
