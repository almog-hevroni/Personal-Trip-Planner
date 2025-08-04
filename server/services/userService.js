import * as repo from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

export async function register({ name, email, password }) {
  // Validate required fields
  if (!name || !email || !password)
    throw { status: 400, message: "Missing fields" };
  // Prevent duplicate accounts
  if (await repo.findByEmail(email))
    throw { status: 409, message: "Email in use" };
  // Hash password for secure storage
  const hash = await bcrypt.hash(password, 10);
  return repo.createUser({ name, email, passwordHash: hash });
}

export async function login({ email, password }) {
  // Lookup user by email
  const user = await repo.findByEmail(email);
  if (!user) throw { status: 401, message: "Invalid credentials" };
  // Compare provided password against stored hash
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw { status: 401, message: "Invalid credentials" };
  return user;
}
