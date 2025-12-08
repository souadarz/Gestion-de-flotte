import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.get("/", ()=>{
    res.send("app gestion de flotte")
});

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

export default app;