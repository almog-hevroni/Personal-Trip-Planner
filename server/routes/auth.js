// server/routes/auth.js

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 * tags:
 *   - name: Auth
 *     description: רוטים להרשמה והתחברות
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already in use
 */
router.post("/register", async (req, res) => {
  try {
    //1. בדיקת שדות חובה (name, email, password)
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // 2. בדיקת ייחודיות אימייל במסד
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // 3. יצירת salt והצפנת הסיסמה עם bcrypt.hash
    //יוצר salt חדש – מחרוזת אקראית שתתערבב עם הסיסמה לפני ההצפנה.
    //הפרמטר 10 (rounds) מציין את עוצמת (cost) ה־salt:
    //ככל שהמספר גבוה יותר, הפעולה יותר “יקרה” מבחינת מחשוב (עושה יותר סיבובים).
    //ערכים בין 10–12 נפוצים במערכות פרודקשן לאבטחה טובה ועדיין ביצועים סבירים.
    const salt = await bcrypt.genSalt(10);

    //מקבל את הסיסמה הגולמית (password) + ה־salt שיצרנו
    //מפעיל אלגוריתם Blowfish מבוסס bcrypt כדי לייצר Hash
    //התוצאה (passwordHash) היא מחרוזת ארוכה שמכילה גם חלק מה־salt וגם את תוצאת ההצפנה.
    //משתמשים בזה בשלב ההרשמה פני ששומרים את המשתמש ב־DB, כדי שארטילריית הנתונים הקשים תהיה חסינה לזליגת סיסמאות.
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. שמירת משתמש חדש ב־MongoDB
    const newUser = new User({ name, email, passwordHash });
    await newUser.save();

    // 5. החזרת סטטוס 201 במידה והכל תקין
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Returns JWT and user info
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {
  try {
    // 1. בדיקת שדות חובה (email, password)
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    // 2. שליפת המשתמש לפי email; אם לא קיים – 401
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. השוואת הסיסמה שהתקבלה עם ה־passwordHash
    //מקבל סיסמה גולמית (password) ושם את ה־hash ששמור במסד (user.passwordHash)
    //בודק האם, כשמזינים את ה-plainText + ה-salt המקורי, יוצא אותו hash
    //משתמשים בשלב ה־login, כדי לוודא שהסיסמה שהזין המשתמש תואמת לסיסמה המוצפנת ששמרנו.
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. יצירת JWT עם jwt.sign ו־JWT_SECRET
    //JWT (JSON Web Token)
    //הוא Token שמכיל בתוכו (ב-payload) מידע מזוהה על המשתמש (כגון userId, name).
    // הוא חתום דיגיטלית בעזרת מחרוזת סודית (JWT_SECRET), כך שאפשר לאמת שלא נשמט או שונה.
    const payload = { userId: user._id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 5. החזרת הטוקן ופרטי המשתמש
    return res.json({
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Invalid or missing token
 */
router.post("/logout", authenticateToken, (req, res) => {
  // מכיוון ש-JWT הוא stateless, אין התנהלות בצד-שרת:
  // פשוט מחזירים תשובה, ו־client מוחק את הטוקן שלו.
  return res.json({ message: "User logged out successfully" });
});

export default router;
