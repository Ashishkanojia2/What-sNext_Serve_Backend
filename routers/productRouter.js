import express from "express";
import isAuthenticated from "../middleware/auth.js";
import { addProduct, getAllProducts, getProductReview, getSingleProductInfo, postReview } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/allProducts", getAllProducts);
productRouter.post("/addProduct", isAuthenticated, addProduct);
productRouter.get("/getSingleProductInfo", getSingleProductInfo);
productRouter.post('/postReview', isAuthenticated, postReview)
productRouter.get('/getProductReview', getProductReview)
export default productRouter;
