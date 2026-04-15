import { config } from "dotenv";
import { app } from "./app.js";
import { connectDataBase } from "./config/database.js";
import cloudinary from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

config({ path: "./config/config.env" });
connectDataBase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is Running on port :: ", PORT);
});
