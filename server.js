import { config } from "dotenv";
import { app } from "./app.js";
import { connectDataBase } from "./config/database.js";

config({ path: "./config/config.env" });
connectDataBase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is Running on port :: ", PORT);
});
