import { errorRes, successRes } from "../utils/globalResponseHandler.js";
import { emailRegex, passwordRegex } from "../utils/regex.js";
import { sendToken } from "../utils/sendToken.js";
import sendMail from "../utils/sendMail.js";
import { getOtp } from "../utils/otpGenerate.js";
import { sellerModal } from "../modals/sellerModal.js";


const register = async (req, res) => {
  try {
    let { name, email, password, address, phone, business } = req.body;
    let seller = await sellerModal.findOne({ email });
    if (seller) return errorRes(res, 400, "seller already exists");

    const otp = Math.floor(Math.random() * 100000);
    const otp_expiry = new Date(
      Date.now() + Number(process.env.OTP_EXPIRE || 10) * 60 * 1000,
    );
    seller = await sellerModal.create({
      name,
      email,
      password,
      otp,
      otp_expiry,
      address,
      phone,
      business: {
        name: business.name,
        type: business.type,
        gstNo: business.gstNo,
        location: business.location,
      },
    });
    await sendMail({
      email,
      subject: "Registration Confirmation",
      message: `Please don't share OTP with anyone. Your OTP is : ${otp}`,
    });

    sendToken(
      res,
      seller,
      201,
      "OTP sent successfully to your registered email",
    );
  } catch (error) {
    console.error("Register Catch Error:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
};
const verify = async (req, res) => {
  try {
    const otp = Number(req.body.otp);
    if (!otp) errorRes(res, 400, "please enter otp");
    const seller = await sellerModal.findById(req.seller._id);
    if (seller.otp_expiry < Date.now()) {
      return errorRes(res, 400, "otp expire. please resend the otp");
    }
    if (seller.otp === otp) {
      seller.verified = true;
      seller.otp = null;
      seller.otp_expiry = null;
      await seller.save();
      return successRes(res, 200, "seller verify successfully");
    } else {
      errorRes(res, 400, "Invalid OTP");
    }
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return errorRes(res, 400, "Please enter email");
    if (!password) return errorRes(res, 400, "Please enter password");
    if (!emailRegex(email))
      return errorRes(res, 400, "Please enter valid email");
    if (!passwordRegex(password))
      return errorRes(
        res,
        400,
        "Password must contain 8 char, 1 uppercase, 1 number, and 1 special char.",
      );
    let seller = await sellerModal.findOne({ email }).select("+password");
    if (!seller) return errorRes(res, 400, "seller not found!");
    const isMatch = await seller.comparePassword(password);
    if (!isMatch) return errorRes(res, 400, "Invalid crendintals");
    const token = await seller.getJWTToken();
    return res
      .status(200)
      .cookie("token", token)
      .json({
        success: true,
        message: "Login Successfully",
        token,
        seller: {
          email: seller.email,
          name: seller.name,
          _id: seller._id,
        },
      });
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) errorRes(res, 400, "Please enter email");
  const seller = await sellerModal.findOne({ email });
  if (!seller) return errorRes(res, 400, "Invalid email");
  const otp = getOtp();

  seller.resetPasswordOtp = otp;
  seller.resetPassword_Expire = Date.now() + 10 * 60 * 1000;
  successRes(res, 200, "Successfull");
};
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const seller = await getUserData(email);
  if (!seller) return errorRes(res, 400, "Invalid email");
  seller.password = newPassword;
  seller.resetPasswordOtp = null;
  seller.resetPassword_Expire = null;
  await seller.save();
  successRes(res, 200, "Password reset successfully");
};
const logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", null, { expires: new Date(Date.now()) })
    .json({ success: true, message: "Logout successfully" });
};
const updatePasssword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return errorRes(res, 400, "Please enter old and new password");
    const seller = await getUserData(req.seller.email);
    if (!seller) return errorRes(res, 400, "seller not found");
    const isMatch = await seller.comparePassword(oldPassword);
    if (!isMatch) return errorRes(res, 400, "Invalid old password");
    seller.password = newPassword;
    await seller.save();
    successRes(res, 200, "Password updated successfully");
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
export {
  register,
  login,
  verify,
  forgotPassword,
  resetPassword,
  logout,
  updatePasssword,
};
