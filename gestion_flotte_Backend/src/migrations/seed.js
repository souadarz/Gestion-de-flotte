import bcrypt from "bcryptjs";
import User from "../models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to database");

  const seedAdmin = async () => {

    await User.create({
      nom: "Admin",
      email: "admin@gmail.com",
      motDePasse: "password",
      role: "admin",
    });

    console.log("admin ajouté");
  };

  seedAdmin()
    .then(() => {
      console.log("Seed terminé");
      process.exit();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} catch (error) {
  console.error("Seeding failed:", error);
  process.exit(1);
}
