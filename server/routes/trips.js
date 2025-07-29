// File: server/routes/trips.js

import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as tripCtrl from "../controllers/tripController.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - location
 *         - startingPoint
 *         - endingPoint
 *         - totalLengthKm
 *         - days
 *         - route
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
 *         location:
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
 *             required:
 *               - day
 *               - lengthKm
 *               - startingPoint
 *               - endingPoint
 *               - description
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
 *         route:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - lat
 *               - lng
 *               - day
 *             properties:
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               day:
 *                 type: integer
 *         imageUrl:
 *           type: string
 *         weather:
 *           type: object
 */

/**
 * @openapi
 * tags:
 *   - name: Trips
 *     description: CRUD operations for trips
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
router.get("/", authenticateToken, tripCtrl.getAll);

/**
 * @openapi
 * /api/trips:
 *   post:
 *     summary: Save a trip object to the database
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Trip data to save
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
router.post("/", authenticateToken, tripCtrl.create);

/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     summary: Get a single trip by its ID, enriched with a 3-day weather forecast
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the trip
 *     responses:
 *       200:
 *         description: Trip retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Invalid or missing JWT
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authenticateToken, tripCtrl.getOne);

/**
 * @openapi
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip by its ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the trip
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       403:
 *         description: Not authorized to delete this trip
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateToken, tripCtrl.remove);

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
router.post("/generate", authenticateToken, tripCtrl.generate);

export default router;
