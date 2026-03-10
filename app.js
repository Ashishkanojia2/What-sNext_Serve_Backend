import express from "express";
import usersRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import productRouter  from "./routers/productRouter.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Mount routers
app.use("/api/v1", usersRouter);
app.use("/api/v1/product", productRouter);
