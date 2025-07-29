// server/services/tripService.js
import * as repo from "../repositories/tripRepository.js";

export function listUserTrips(userId) {
  return repo.findAllByUser(userId);
}

export async function getTrip(id, userId) {
  const trip = await repo.findById(id);
  if (!trip) throw { status: 404, message: "Trip not found" };
  if (trip.userId.toString() !== userId)
    throw { status: 403, message: "Not yours" };
  return trip;
}

export function saveTrip(data) {
  return repo.createTrip(data);
}

export async function deleteTrip(id, userId) {
  await getTrip(id, userId);
  return repo.deleteById(id);
}
