import jwt from "jsonwebtoken";
import User from "../../models/user.model.js"; 

const verifyLogin = async (req, res, next) => {
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).select("name email");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No user found",
      });
    }

    req.loggedInUser = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default verifyLogin;
