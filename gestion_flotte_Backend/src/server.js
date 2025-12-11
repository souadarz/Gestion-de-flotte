import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import ErrorHandler from "./middleware/errorHandler.js";
import allRoutes from "./routes/index.js";
import "./config/mail.js";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res)=>{
    res.send("app gestion de flotte")
});

const PORT = process.env.PORT || 3000;

app.use("/api", allRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

app.use(ErrorHandler);

export default app;