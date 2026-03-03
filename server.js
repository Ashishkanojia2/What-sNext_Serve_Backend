import { config } from "dotenv";
import { app } from "./app.js";
import { connectDataBase } from "./database.js";

config({ path: "./config/config.env" });
connectDataBase();

app.listen(process.env.PORT, () => {
  console.log("Server is Running on port :: ", process.env.PORT);
});
