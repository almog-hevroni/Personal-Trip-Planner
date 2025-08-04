import jwt from "jsonwebtoken";
import * as userSvc from "../services/userService.js";

// Handle user registration
export async function register(req, res, next) {
  try {
    await userSvc.register(req.body);
    res.status(201).json({ message: "Registered" });
  } catch (err) {
    next(err);
  }
}

// Handle user login, return JWT + public user info
export async function login(req, res, next) {
  try {
    const user = await userSvc.login(req.body);
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

// Stateless logout – client just discards token
export function logout(req, res) {
  res.json({ message: "Logged out" });
}
