import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
    trim:true
  },
  avatar: {
    publicId: String,
    url: String,
  },
  createdAt: {
    type: Date,
    timestamps: true

  },
  verified: {
    type: Boolean,
    default: false,
  },
  query: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserQuery",
      },
    ],
    default: [],
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductReview",
      required: true
    },
  ],
  phone: {
    type: String,
    // validate: {
    //   validator: function (v) {
    //     if (!v) return true;
    //     const clean = v.replace(/\s+/g, "");
    //     return /^(\+91)?[6-9]\d{9}$/.test(clean);
    //   },
    //   message: "Invalid Indian phone number"
    // }
  },
  landMark: {
    type: String
  },
  pinCode: {
    type: String
  },
  address: {
    type: String
  },
  otp: Number,
  otp_expiry: Date,
  resetPasswordOtp: Number,
  resetPassword_Expire: Date,
});
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE * 24 * 60 * 60 * 1000,
  });
};
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });
export const userModal = mongoose.model("User", userSchema);
