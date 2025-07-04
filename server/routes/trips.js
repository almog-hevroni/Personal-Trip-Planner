// server/routes/trips.js

import express from "express";
import Trip from "../models/Trip.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *         type:
 *           type: string
 *           enum: [bike, trek]
 *         description:
 *           type: string
 *         startingPoint:
 *           type: string
 *         endingPoint:
 *           type: string
 *         totalLengthKm:
 *           type: number
 *         days:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: integer
 *               lengthKm:
 *                 type: number
 *               startingPoint:
 *                 type: string
 *               endingPoint:
 *                 type: string
 *               description:
 *                 type: string
 *         weather:
 *           type: object
 *         imageUrl:
 *           type: string
 *         route:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               day:
 *                 type: integer
 *       required:
 *         - title
 *         - type
 *         - description
 *         - startingPoint
 *         - endingPoint
 *         - totalLengthKm
 *         - days
 *         - route
 */

/**
 * @openapi
 * /api/trips:
 *   get:
 *     summary: Get all saved trips for the authenticated user
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(trips);
  } catch (err) {
    console.error("Fetch trips error:", err);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
});

/**
 * @openapi
 * /api/trips:
 *   post:
 *     summary: Save a trip object to the database
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       201:
 *         description: Trip saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Validation error
 */
router.post("/", authenticateToken, async (req, res) => {
  const {
    title,
    type,
    description,
    startingPoint,
    endingPoint,
    totalLengthKm,
    days,
    weather,
    imageUrl,
    route,
  } = req.body;
  try {
    const trip = new Trip({
      userId: req.user.userId,
      title,
      type,
      description,
      startingPoint,
      endingPoint,
      totalLengthKm,
      days,
      weather,
      imageUrl,
      route,
    });
    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    console.error("Save trip error:", err);
    res
      .status(400)
      .json({ message: "Failed to save trip", error: err.message });
  }
});

/**
 * @openapi
 * /api/trips/generate:
 *   post:
 *     summary: Generate a full trip itinerary via LLM
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - type
 *             properties:
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [bike, trek]
 *     responses:
 *       200:
 *         description: Generated trip object with detailed daily breakdown
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Could not generate trip with constraints
 *       500:
 *         description: Server or AI error
 */
router.post("/generate", authenticateToken, async (req, res) => {
  const { location, type } = req.body;

  const prompt = `
Generate a ${type} trip for "${location}", broken down by day, with both geodata for the map and rich descriptions.

Rules:
- If type is "bike": exactly 2 consecutive days; each day ≤ 60 km; total ≤ 120 km.
- If type is "trek": a multi-day hike; each day between 5–15 km; the entire trip (from startingPoint to endingPoint) must form a loop—i.e., endingPoint must be identical to startingPoint.

Output only a single JSON object with these fields:
{
  "title": "<string>",
  "type": "${type}",
  "route": [
    { "lat": <number>, "lng": <number>, "day": 1 },
    …
  ],
  "startingPoint": "<string>",
  "endingPoint": "<string>",
  "totalLengthKm": <number>,
  "days": [
    {
      "day": 1,
      "lengthKm": <number>,
      "startingPoint": "<string>",
      "endingPoint": "<string>",
      "description": "<string>"
    },
    { "day": 2, … }
  ],
  "weather": { /* structure for forecast, temp, etc. */ },
  "imageUrl": "<string>"
}

If you cannot satisfy constraints, return:
  { "error": "Could not generate trip with these constraints, please try again." }
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    const tripData = JSON.parse(completion.choices[0].message.content);

    if (tripData.error) {
      return res.status(400).json({ message: tripData.error });
    }

    return res.json(tripData);
  } catch (err) {
    console.error("AI generation error:", err);
    return res.status(500).json({ message: "Failed to generate trip" });
  }
});

export default router;
