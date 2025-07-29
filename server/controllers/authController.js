// server/controllers/authController.js
import jwt from "jsonwebtoken";
import * as userSvc from "../services/userService.js";

export async function register(req, res, next) {
  try {
    await userSvc.register(req.body);
    res.status(201).json({ message: "Registered" });
  } catch (err) {
    next(err);
  }
}

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

export function logout(req, res) {
  // Stateless JWT — אין פעולות בצד־שרת
  res.json({ message: "Logged out" });
}
