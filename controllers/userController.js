import { userModal } from "../modals/usersModal.js";
import { errorRes, successRes } from "../utils/globalResponseHandler.js";
import { emailRegex, passwordRegex } from "../utils/regex.js";
import { sendToken } from "../utils/sendToken.js";
import sendMail from "../utils/sendMail.js";
import { getOtp } from "../utils/otpGenerate.js";
const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let user = await userModal.findOne({ email });
    if (user) return errorRes(res, 400, "user already exists");

    const otp = Math.floor(Math.random() * 100000);
    const otp_expiry = new Date(
      Date.now() + Number(process.env.OTP_EXPIRE || 10) * 60 * 1000,
    );
    user = await userModal.create({
      name,
      email,
      password,
      otp,
      otp_expiry,
    });
    await sendMail({
      email,
      subject: "Registration Confirmation",
      message: `Please don't share OTP with anyone. Your OTP: ${otp}`,
    });

    sendToken(res, user, 201, "OTP sent successfully to your registered email");
  } catch (error) {
    console.error("Register Catch Error:", error);
    res.status(500).json({ success: false, message: error.message || error });
  }
};
const verify = async (req, res) => {
  try {
    console.log("What we recived", req);
    const otp = Number(req.body.otp);
    if (!otp) errorRes(res, 400, "please enter otp");
    const user = await userModal.findById(req.user._id);

    if (user.otp_expiry < Date.now()) {
      return errorRes(res, 400, "otp expire. please resend the otp");
    }
    if (user.otp === otp) {
      user.verify = true;
      user.otp = null;
      user.otp_expiry = null;
      await user.save();
      return successRes(res, 201, "user verify successfully");
    } else {
      errorRes(res, 400, "Invalid OTP");
    }
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const login = async (req, res) => {
  try {
    console.log("login request", req.body);
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
    let user = await userModal.findOne({ email }).select("+password");
    if (!user) return errorRes(res, 400, "Invalid crendintals");
    const isMatch = await user.comparePassword(password);
    if (!isMatch) errorRes(res, 400, "Invalid crendintals");
    successRes(res, 200, "Login Successfully");
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) errorRes(res, 400, "Please enter email");
  const user = await userModal.findOne({ email });
  if (!user) return errorRes(res, 400, "User not found");
  const otp = getOtp();

  user.resetPasswordOtp = otp;
  user.resetPassword_Expire = Date.now() + 10 * 60 * 1000;
  successRes(res, 200, "Successfull");
};

const resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
};

const logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", null, { expires: new Date(Date.now()) })
    .json({ success: true, message: "Logout successfully" });
};
export { register, login, verify, forgotPassword, resetPassword, logout };
