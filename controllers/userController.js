import { userModal } from "../modals/usersModal.js";
import {
  errorRes,
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
    successReSend(res, 200, "User profile fetched successfully", user);
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { pinCode, address, landMark, phone, name } = req.body || {};
    const user = req.user;
    if (!user?._id) return errorRes(res, 403, "user not found login first");
    let myCloudeProfile = user.avatar;
    if (req.file?.path) {
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }
      const uploaded = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "whatNext_usersProfle",
      });

      myCloudeProfile = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.pinCode = pinCode || user.pinCode;
    user.landMark = landMark || user.landMark;
    user.name = name || user.name;
    user.avatar = myCloudeProfile;
    await user.save();
    successReSend(res, 201, "Profile update successfully", user);
  } catch (error) {
    console.log("Catch error of updateProfile", error);
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];
      return errorRes(res, 400, firstError.message);
    }
    return errorRes(res, 500, "Internal server error", error);
  }
};
