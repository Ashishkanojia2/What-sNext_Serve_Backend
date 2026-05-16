import express from "express";
import usersRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import productRouter  from "./routers/productRouter.js";
import fileUpload from "express-fileupload";
import AuthRouter from "./routers/AuthRouter.js";
import AppRouter from "./routers/AppRouter.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
// app.use(fileUpload({
//     useTempFiles: true,
//     // tempFileDir: "/tmp/",
//     limits: { fileSize: 50 * 1024 * 1024 },
//     // abortOnLimit: true,

// }))

app.use("/api/v1", AuthRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/product", productRouter);
app.use('/api/v1/app',AppRouter)
