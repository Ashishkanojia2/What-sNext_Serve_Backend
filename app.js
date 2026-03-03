import express from "express";
import  {userModal}  from "./modals/usersModal.js";
export const app = express();

app.use("api/v1", userModal);
app.use(express.json);
app.use(express.urlencoded({ extended: true }));
