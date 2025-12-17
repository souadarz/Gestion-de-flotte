import bcrypt from "bcryptjs";
import User from "../models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to database");

  const seedAdmin = async () => {
    const userData = {
      nom: "Admin",
      email: "admin@gmail.com",
      motDePasse: "password",
      role: "admin",
    };
      console.log(`➡️ Vérification de l'utilisateur : ${userData.email}`);
      const existingUser = await User.findOne({ email: userData.email });
    if(!existingUser){
      await User.create(userData);

      console.log("admin ajouté");
    }else{
      console.log("user non créé");
    }
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