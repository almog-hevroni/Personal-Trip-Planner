import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Sub-schema for geo-coordinates with day index
const geoPointSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  day: { type: Number, required: true },
});

// Sub-schema for point of interst is there are any
const poiSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

// Sub-schema for daily itinerary details
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
    type: { type: String, enum: ["bike", "trek"], required: true },
    description: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, required: true },

    startingPoint: { type: String, required: true },
    endingPoint: { type: String, required: true },
    totalLengthKm: { type: Number, required: true },
    days: { type: [dayDetailSchema], default: [] },

    route: { type: [geoPointSchema], default: [] },
    imageUrl: { type: String },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export default model("Trip", tripSchema);
