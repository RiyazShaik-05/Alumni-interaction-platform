import jwt from "jsonwebtoken";
import { pool } from "../../db/index.js";

const verifyLogin = async (req, res, next) => {
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  // console.log("token in middleware",token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is not provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    // console.log("decoded email",decoded.email);
    const [ user ] = await pool.execute("SELECT name,email FROM users WHERE email = ?", [decoded.email]);

    // console.log(user);

    if (!user || user.length === 0) {
      return res.status(401).json({
        success: false,
        message: "No user found"
      });
    }

    // console.log(req.body);
    req.registeredUser = user[0]; // Set user info in req.user
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};


export default verifyLogin;