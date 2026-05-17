import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    required: true,
  },
  paid: {
    type: String,
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
});

export const paymentModal = mongoose.model("Payment", paymentSchema);
