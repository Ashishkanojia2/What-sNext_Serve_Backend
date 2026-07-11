import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sellerId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
  ],
  productId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  deliveredAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  paymentMode: {
    type: String,
    required: true,
  },

});

export const orderModal = mongoose.model("Order", orderSchema);
