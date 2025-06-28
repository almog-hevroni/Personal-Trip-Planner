// server/index.js
import "dotenv/config"; //טוען משתני סביבה מקובץ .env
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { swaggerUi, specs } from "./swagger.js"; // ייבוא Swagger כדי להציג תיעוד ב־/api-docs
import authRouter from "./routes/auth.js"; // ייבוא רוטים של אימות משתמשים
import tripsRouter from "./routes/trips.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
//במסגרת Express Middleware הוא פשוט פונקציה (או אוסף פונקציות) שמתווכת בין בקשת HTTP שנכנסת (request) לבין התשובה שיוצאת (response).
//היא מאפשרת “להישכב” על הזרימה, לבצע לוגיקה, לשנות נתונים או לחסום את הבקשה לפני שהיא מגיעה ל־route עצמו.
app.use(cors()); // מאפשר גישה ממקורות שונים
app.use(express.json()); // מאפשר קריאת JSON בבקשות

// חיבור ל-MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// רישום רוטים
app.use("/api/auth", authRouter); // כל נתיב שמתחיל ב־/api/auth/* עובר ל־authRouter
app.use("/api/trips", tripsRouter); // כל נתיב שמתחיל ב־/api/trips/* עובר ל־tripsRouter

// תיעוד ב-Swagger UI
app.use(
  "/api-docs", /// <-- כאן נוצרת הכתובת http://localhost:5000/api-docs
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
