// server/repositories/tripRepository.js
import Trip from "../models/Trip.js";

export function findAllByUser(userId) {
  return Trip.find({ userId }).sort({ createdAt: -1 });
}
export function findById(id) {
  return Trip.findById(id).lean();
}
export function createTrip(data) {
  const t = new Trip(data);
  return t.save();
}
export function deleteById(id) {
  return Trip.findByIdAndDelete(id);
}
