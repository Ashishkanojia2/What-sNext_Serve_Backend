import mongoose from "mongoose";

export const connectDataBase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo Connection : ", connection.host);
  } catch (error) {
    console.log("Mongoose connction Error : ", error);
    process.exit(1);
  }
};
