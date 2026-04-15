import express from "express";
import usersRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import productRouter  from "./routers/productRouter.js";
import fileUpload from "express-fileupload";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    // tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
    // abortOnLimit: true,
    // responseOnLimit: "File size limit has been reached",
}))

// Mount routers
app.use("/api/v1", usersRouter);
app.use("/api/v1/product", productRouter);
