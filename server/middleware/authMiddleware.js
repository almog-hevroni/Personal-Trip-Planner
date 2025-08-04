import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
// Extract "Bearer <token>" header
  const authHeader = req.headers.authorization || ""; // "Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
   // Verify signature & expiry
    const payload = jwt.verify(token, process.env.JWT_SECRET);
   // Attach decoded payload (userId, name) to request
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
