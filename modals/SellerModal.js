import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  business: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    gstNo: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  sellingProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  soldProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  earnings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  otp: Number,
  otp_expiry: Date,
  resetPasswordOtp: Number,
  resetPassword_Expire: Date,
});
sellerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

sellerSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE * 24 * 60 * 60 * 1000,
  });
};
sellerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// export const sellerModal = mongoose.model("Seller", sellerSchema);
export const sellerModal =
  mongoose.models.Seller || mongoose.model("Seller", sellerSchema);