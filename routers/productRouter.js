import express from "express";
import { isAuthenticated, isSellerAuthenticated } from "../middleware/auth.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
  getProductReview,
  postReview,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/allProducts", getAllProducts);
productRouter.post("/addProduct", isSellerAuthenticated, addProduct);
productRouter.get("/getProductById", getProductById);
productRouter.post("/postReview", isAuthenticated, postReview);
productRouter.get("/getProductReview", getProductReview);
export default productRouter;
