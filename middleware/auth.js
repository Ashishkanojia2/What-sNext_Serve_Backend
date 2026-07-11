import jwt from "jsonwebtoken";
import { userModal } from "../modals/usersModal.js";
import { errorRes } from "../utils/globalResponseHandler.js";
import { sellerModal } from "../modals/SellerModal.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) errorRes(res, 401, "InValid Token , Login first");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModal.findById(decodedToken._id);
    next();
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const isSellerAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);

    const { token } = req.cookies;
    console.log(
      "----SELLER TOKEN---------------------------------------",
      token,
    );
    if (!token && !authHeader)
      return errorRes(res, 401, "InValid Token , Login first");
    let validToken = token || authHeader.split(" ")[1];
    if (token) {
    }
    const decodedToken = jwt.verify(validToken, process.env.JWT_SECRET);
    const seller = await sellerModal.findById(decodedToken._id);
    console.log("------- SELLER INFO --------", seller);
    req.seller = seller;
    next();
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

export { isAuthenticated, isSellerAuthenticated };
