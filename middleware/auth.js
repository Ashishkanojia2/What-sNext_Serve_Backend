import jwt from "jsonwebtoken";
import { userModal } from "../modals/usersModal.js";
import { errorRes } from "../utils/globalResponseHandler.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("req",req);
    
    if (!token) errorRes(res, 401, "InValid Token , Login first");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModal.findById(decodedToken._id);
    next();
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

export default isAuthenticated