import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  avatar: {
    publicId: String,
    url: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  otp: Number,
  otp_expiry: Date,
});

export const userModal = mongoose.model("User", userSchema);