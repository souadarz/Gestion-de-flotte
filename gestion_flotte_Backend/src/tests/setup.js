import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

before(async function () {
  this.timeout(20000);

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
});

after(async function () {
  await mongoose.connection.close();
  console.log("MongoDB disconnected");
});