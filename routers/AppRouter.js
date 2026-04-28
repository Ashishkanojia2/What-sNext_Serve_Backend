import express from "express";
import {
  TermsAndConditions,
  PrivacyPolicy,
  contactUs,
} from "../controllers/AppController.js";
import isAuthenticated from "../middleware/auth.js";

const AppRouter = express.Router();

AppRouter.get("/TermsAndConditions", TermsAndConditions);
AppRouter.get("/PrivacyPolicy", PrivacyPolicy);
AppRouter.post('/ContactUs',isAuthenticated, contactUs)
export default AppRouter;
