import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import ErrorHandler from "./middleware/errorHandler.js";
import allRoutes from "./routes/index.js";
import "./config/mail.js";
import cors from "cors";

dotenv.config();
connectDB();
const app = express();


// app.use(cors());

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("app gestion de flotte");
});

app.use("/api", allRoutes);

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(ErrorHandler);

export default app;
