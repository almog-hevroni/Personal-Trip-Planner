
// Load environment variables from .env file into process.env
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { swaggerUi, specs } from "./swagger.js"; // Swagger UI setup for API docs
import authRouter from "./routes/auth.js"; // Auth routes (register, login, logout)
import tripsRouter from "./routes/trips.js"; // Trip CRUD & generate routes

const app = express();

// ------------------
// Global middleware
// ------------------

// Enable CORS so that frontend (possibly on another origin) can call our API
app.use(cors());
// Parse incoming JSON bodies and make them available on req.body
app.use(express.json());

// ------------------
// Database Connection
// ------------------

// Connect to MongoDB using the URI from environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ------------------
// Swagger Documentation
// ------------------

// Serve Swagger UI at /api-docs using our generated OpenAPI specs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// ------------------
// Route Registration
// ------------------

// Mount auth-related routes under /api/auth
app.use("/api/auth", authRouter);
// Mount trip-related routes under /api/trips
app.use("/api/trips", tripsRouter);

// ------------------
// Global Error Handler
// ------------------

// Catch any errors thrown in routes or middleware
app.use((err, req, res, next) => {
  // Use provided status or default to 500 (Internal Server Error)
  const status = err.status || 500;
  // Send JSON with error message
  res.status(status).json({ message: err.message || "Server error" });
});

// ------------------
// Server Startup
// ------------------

// Use PORT from env or default to 5000
const PORT = process.env.PORT || 5000;
// Start listening for incoming HTTP requests
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
