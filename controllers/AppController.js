import {
  errorRes,
  successRes,
  successReSend,
} from "../utils/globalResponseHandler.js";
import { Terms_And_Conditions } from "../utils/rawData/TermAndConditon.js";
import { Privacy_Policy } from "../utils/rawData/PrivacyPolicy.js";
import { userQueryModal } from "../modals/userQuery.js";
import { userModal } from "../modals/usersModal.js";

const TermsAndConditions = (req, res) => {
  try {
    const termsData = Terms_And_Conditions.data;
    successReSend(
      res,
      200,
      "Terms and Conditions fetched successfully",
      termsData,
    );
  } catch (error) {
    console.log("Error:", error);
  }
};

const PrivacyPolicy = (req, res) => {
  try {
    const privacyData = Privacy_Policy.data;
    successReSend(res, 200, "Privacy Policy fetched successfully", privacyData);
  } catch (error) {
    console.log("Error:", error);
  }
};

const contactUs = async (req, res) => {
  try {
    // use the user populated by the `isAuthenticated` middleware
    const user = req.user;
    console.log("User:", user);

    if (!user) {
      return errorRes(res, 401, "User does not exist. Please register first", null);
    }
    const { title, message } = req.body;
    if (!title || !message) {
      return errorRes(res, 400, "Title and message are required", null);
    }
    const { name, email, _id } = req.user;
    const newQuery = await userQueryModal.create({
      userid: _id,
      name,
      email,
      title,
      message,
    });

    user.query.push(newQuery._id);
    await user.save();

    successRes(
      res,
      200,
      "Query submitted successfully our support team will contact you shortly.",
      newQuery,
    );
  } catch (error) {
    errorRes(res, 400, error.message);
    console.log("Error::", error);
  }
};

export { TermsAndConditions, PrivacyPolicy, contactUs };
