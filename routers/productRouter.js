import express from "express";
import isAuthenticated from "../middleware/auth.js";
import { addProduct, getAllProducts, getSingleProductInfo } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/allProducts", getAllProducts);
productRouter.post("/addProduct", isAuthenticated, addProduct);
productRouter.get("/getSingleProductInfo", getSingleProductInfo);
export default productRouter;
