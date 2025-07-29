// File: server/controllers/tripController.js

import * as tripSvc from "../services/tripService.js";
import { fetchWeather, fetchImage } from "../utils/externalData.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Get all trips for the authenticated user
 */
export async function getAll(req, res, next) {
  try {
    const trips = await tripSvc.listUserTrips(req.user.userId);
    res.json(trips);
  } catch (err) {
    next(err);
  }
}

/**
 * Get a single trip by its ID (with weather enrichment)
 */
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

/**
 * Create & save a new trip
 */
export async function create(req, res, next) {
  try {
    const data = { ...req.body, userId: req.user.userId };
    const trip = await tripSvc.saveTrip(data);
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a trip by its ID
 */
export async function remove(req, res, next) {
  try {
    await tripSvc.deleteTrip(req.params.id, req.user.userId);
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * Generate a full trip itinerary via LLM
 */
export async function generate(req, res, next) {
  const { location, type } = req.body;

  const prompt = `
Generate a ${type} trip for "${location}", broken down by day, with map-ready geodata and vivid descriptions.

Rules:
- If type is "bike": exactly 2 consecutive days; each day ≤ 60 km; total ≤ 120 km.
- If type is "trek": 3 or more days; each day 5–15 km; the trip must form a loop (startingPoint = endingPoint).

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
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a trip-itinerary generator." },
        { role: "user", content: prompt },
      ],
    });

    const tripData = JSON.parse(completion.choices[0].message.content);
    if (tripData.error) {
      return res.status(400).json({ message: tripData.error });
    }

    // Enrich with weather and image
    const { lat, lng } = tripData.route[0];
    try {
      tripData.weather = await fetchWeather(lat, lng);
    } catch {
      tripData.weather = { forecast: [] };
    }
    try {
      tripData.imageUrl = await fetchImage(location);
    } catch {
      tripData.imageUrl = "";
    }

    res.json(tripData);
  } catch (err) {
    next(err);
  }
}
