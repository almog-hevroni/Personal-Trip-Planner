// server/repositories/userRepository.js
import User from "../models/User.js";

export function findByEmail(email) {
  return User.findOne({ email });
}
export function createUser(data) {
  const u = new User(data);
  return u.save();
}
export function findById(id) {
  return User.findById(id);
}
