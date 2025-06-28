// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  // 1. קבלת הטוקן מתוך כותרת Authorization
  const authHeader = req.headers.authorization || ""; // "Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // 2. אימות הטוקן (מפעיל גם בדיקת החתימה ותוקף הזמן)
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // 3. אם תקין, שמירת הנתונים מ־payload ב־req.user
    req.user = payload;
    // 4. קריאה לפונקציית next() כדי להמשיך ל־route הבא
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
