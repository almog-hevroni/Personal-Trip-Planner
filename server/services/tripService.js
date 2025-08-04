import * as repo from "../repositories/tripRepository.js";

export function listUserTrips(userId) {
  // Return all trips for a given user, sorted by creation date desc
  return repo.findAllByUser(userId);
}

export async function getTrip(id, userId) {
  // Fetch trip by ID
  const trip = await repo.findById(id);
  if (!trip) throw { status: 404, message: "Trip not found" };
  // Ensure the trip belongs to the requesting user
  if (trip.userId.toString() !== userId)
    throw { status: 403, message: "Not yours" };
  return trip;
}

export function saveTrip(data) {
  // Create and persist a new trip document
  return repo.createTrip(data);
}

export async function deleteTrip(id, userId) {
  // Validate ownership first, then delete
  await getTrip(id, userId);
  return repo.deleteById(id);
}
