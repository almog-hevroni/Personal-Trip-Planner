// server/models/User.js
//להגדיר schema ואינטראקציה עם collection בשם users ב־MongoDB
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // מוודא שאין שני משתמשים עם אותו מייל
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // יוצר שדות createdAt ו-updatedAt אוטומטית
  }
);

export default mongoose.model("User", userSchema);
