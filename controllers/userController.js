import { userModal } from "../modals/usersModal.js";
import { errorRes, successRes, successReSend } from "../utils/globalResponseHandler.js";

const getUserData = async (email) => {
  return await userModal.findOne({ email }).select("+password");
};

const profile = async (req, res) => {
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

export {
  profile,
};
