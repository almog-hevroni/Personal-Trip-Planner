// server/services/userService.js
import * as repo from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

export async function register({ name, email, password }) {
  if (!name || !email || !password)
    throw { status: 400, message: "Missing fields" };
  if (await repo.findByEmail(email))
    throw { status: 409, message: "Email in use" };
  const hash = await bcrypt.hash(password, 10);
  return repo.createUser({ name, email, passwordHash: hash });
}

export async function login({ email, password }) {
  const user = await repo.findByEmail(email);
  if (!user) throw { status: 401, message: "Invalid credentials" };
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw { status: 401, message: "Invalid credentials" };
  return user;
}
