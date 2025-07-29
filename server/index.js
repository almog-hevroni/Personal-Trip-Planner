// server/index.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { swaggerUi, specs } from "./swagger.js"; // ← תוקן
import authRouter from "./routes/auth.js";
import tripsRouter from "./routes/trips.js";

const app = express();

// Middlewares גלובליים
app.use(cors());
app.use(express.json());

// חיבור ל-MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// תיעוד Swagger UI ב-/api-docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// רישום רוטים
app.use("/api/auth", authRouter);
app.use("/api/trips", tripsRouter);

// Error-handler גלובלי
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
