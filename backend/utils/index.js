import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoute from "../routes/auth.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Booking API is running",
  });
});


// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGO);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
}


const PORT = process.env.PORT || 8800 ;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});