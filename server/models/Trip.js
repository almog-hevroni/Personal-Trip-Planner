// server/models/Trip.js

import mongoose from "mongoose";
const { Schema, model } = mongoose;

// תת־סקימה לנקודות גיאוגרפיות עם יום
const geoPointSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  day: { type: Number, required: true },
});

// תת־סקימה לפוֹאִ'יי (תחנות עניין) — במידה ותחזירי נקודות כאלה
const poiSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

// תת־סקימה לפירוט יומי מלא
const dayDetailSchema = new Schema({
  day: { type: Number, required: true },
  lengthKm: { type: Number, required: true },
  startingPoint: { type: String, required: true },
  endingPoint: { type: String, required: true },
  description: { type: String, required: true },
});

const tripSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, trim: true, required: true },
    type: { type: String, enum: ["bike", "track"], required: true },
    description: { type: String, trim: true, default: "" }, // תיאור קצר למסלול

    // השדות החדשים:
    startingPoint: { type: String, required: true },
    endingPoint: { type: String, required: true },
    totalLengthKm: { type: Number, required: true },
    days: { type: [dayDetailSchema], default: [] },

    // שדות קיימים (route ו-points), משודרגים בהתאם:
    route: { type: [geoPointSchema], default: [] },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default model("Trip", tripSchema);
