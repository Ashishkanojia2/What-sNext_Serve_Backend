import { userModal } from "../modals/usersModal.js";
import fs from "fs";
import {
  errorRes,
  successRes,
  successReSend,
} from "../utils/globalResponseHandler.js";
import cloudinary from "cloudinary";

export const getUserData = async (email) => {
  return await userModal.findOne({ email }).select("+password");
};

export const profile = async (req, res) => {
  try {
    const user = await userModal.findById(req.user._id);
    if (!user) return errorRes(res, 400, "User not found");
    successReSend(res, 200, "User profile fetched successfully", {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { pinCode, address, landMark, phone } = req.body;
    const avatar = req.files?.avatar ?? "";
    const user = req.user;
    if (!user?._id) return errorRes(res, 403, "user not found login first");

    if (!pinCode && !address && !landMark && !phone)
      return errorRes(res, 400, "At least one field is required");

    if (user.avatar) {
      await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
    }

    const myCloudeProfile = await cloudinary.v2.uploader.upload(
      avatar?.tempFilePath,
      {
        folder: "whatNext_usersProfle",
      },
    );
    user.phone = phone || "";
    user.address = address || "";
    user.pinCode = pinCode || "";
    user.landMark = landMark || "";
    user.avatar = {
      public_id: myCloudeProfile.public_id,
      url: myCloudeProfile.secure_url,
    };

    await user.save();
    successRes(res, 201, "Profile update successfully");
    fs.rmSync("./tmp", { recursive: true });
  } catch (error) {
    console.log("Catch error of updateProfile", error);
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];
      return errorRes(res, 400, firstError.message);
    }
    return errorRes(res, 500, "Internal server error");
  }
};
