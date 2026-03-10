import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

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
  verified: {
    type: Boolean,
    default: false,
  },
  resetPasswordOtp:Number,
  resetPassword_Expire :Date
});
userSchema.pre("save", async function () {
  // When using async middleware with Mongoose, don't use the `next` callback.
  // Return early when password is not modified.
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE * 24 * 60 * 60 * 1000,
  });
};
userSchema.methods.comparePassword = async function(password){
 return await bcrypt.compare(password , this.password)

}
userSchema.index({otp_expiry:1},{expireAfterSeconds:0})

export const userModal = mongoose.model("User", userSchema);
