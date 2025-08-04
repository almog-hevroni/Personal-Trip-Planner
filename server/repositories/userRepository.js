import User from "../models/User.js";

export function findByEmail(email) {
  // Look up user by unique email field
  return User.findOne({ email });
}
export function createUser(data) {
  // Create and persist a new User document
  const u = new User(data);
  return u.save();
}
export function findById(id) {
  return User.findById(id);
}
