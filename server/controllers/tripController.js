import * as tripSvc from "../services/tripService.js";
import { fetchWeather, fetchImage } from "../utils/externalData.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// GET /api/trips
export async function getAll(req, res, next) {
  try {
    const trips = await tripSvc.listUserTrips(req.user.userId);
    res.json(trips);
  } catch (err) {
    next(err);
  }
}

// GET /api/trips/:id
export async function getOne(req, res, next) {
  try {
    const trip = await tripSvc.getTrip(req.params.id, req.user.userId);
    if (Array.isArray(trip.route) && trip.route.length > 0) {
      const { lat, lng } = trip.route[0];
      try {
        trip.weather = await fetchWeather(lat, lng);
      } catch {
        trip.weather = { forecast: [] };
      }
    }
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

// POST /api/trips
export async function create(req, res, next) {
  try {
    const data = { ...req.body, userId: req.user.userId };
    const trip = await tripSvc.saveTrip(data);
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/trips/:id
export async function remove(req, res, next) {
  try {
    await tripSvc.deleteTrip(req.params.id, req.user.userId);
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// POST /api/trips/generate
export async function generate(req, res, next) {
  const { location, type } = req.body;

  // Prompt for LLM to generate a valid trip JSON only
  const prompt = `
  Generate a ${type} trip for "${location}", broken down by day, with map-ready geodata and vivid descriptions.

  Rules:
  - If type is "bike": exactly 2 consecutive days; each day 60 km or less; total of 120 km or less.
  - If type is "trek": each day 5–15 km; the trip must form a loop (startingPoint = endingPoint).

  Return exactly one JSON object (no markdown, no commentary):
  {
    "title": "<string>",
    "location": "${location}",
    "type": "${type}",
    "route": [ { "lat": <number>, "lng": <number>, "day": 1 }, … ],
    "startingPoint": "<string>",
    "endingPoint": "<string>",
    "totalLengthKm": <number>,
    "days": [
      { "day": 1, "lengthKm": <number>, "startingPoint": "<string>", "endingPoint": "<string>", "description": "<string>" }
      /* repeat for each day */
    ]
  }

  If you cannot satisfy constraints, return:
  { "error": "Could not generate trip with these constraints, please try again." }
  `;

  try {
    // Send prompt to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a trip-itinerary generator." },
        { role: "user", content: prompt },
      ],
    });

    // Parse the returned JSON
    const tripData = JSON.parse(completion.choices[0].message.content);
    if (tripData.error) {
      return res.status(400).json({ message: tripData.error });
    }

    // Enrich with weather
    const { lat, lng } = tripData.route[0];
    console.log("Fetching weather and image for:", location, lat, lng);
    try {
      tripData.weather = await fetchWeather(lat, lng);
    } catch (weatherErr) {
      if (weatherErr.response?.status === 429) {
        console.error(
          "Weather API error: 429 Too Many Requests – quota exceeded"
        );
      } else {
        console.error("fetchWeather error:", weatherErr);
      }
      tripData.weather = { forecast: [] };
    }

    // Enrich with image
    try {
      tripData.imageUrl = await fetchImage(location);
    } catch (imageErr) {
      console.error("fetchImage error:", imageErr);
      tripData.imageUrl = "";
    }

    res.json(tripData);
  } catch (err) {
    next(err);
  }
}
