import Trip from "../models/Trip.js";

export function findAllByUser(userId) {
  // Find trips where userId matches, sorted by newest first
  return Trip.find({ userId }).sort({ createdAt: -1 });
}
export function findById(id) {
  // Return a JS object
  return Trip.findById(id).lean();
}
export function createTrip(data) {
  // Instantiate and save a new Trip document
  const t = new Trip(data);
  return t.save();
}
export function deleteById(id) {
  // Remove the trip by ID
  return Trip.findByIdAndDelete(id);
}
