import express from "express";
import usersRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import productRouter from "./routers/productRouter.js";
import fileUpload from "express-fileupload";
import AuthRouter from "./routers/AuthRouter.js";
import AppRouter from "./routers/AppRouter.js";
import SellerRouter from "./routers/SellerRouter.js";
import PaymentRouter from "./routers/PaymentRouter.js";
import OrderRouter from "./routers/OrderRouter.js";
import cors from "cors";    

export const app = express();
// const cors = require("cors")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
// enable file uploads for form-data (makes uploaded files available on req.files)
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
		limits: { fileSize: 50 * 1024 * 1024 },
		abortOnLimit: true,
	}),
);

app.use("/api/v1", AuthRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/app", AppRouter);
app.use("/api/v1/seller", SellerRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/order", OrderRouter);
