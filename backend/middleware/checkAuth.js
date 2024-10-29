import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // Ensure this is the correct path

const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; 
    // console.log("Token received:", token); // Debugging line

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token and extract user ID (_id)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded); // Debugging line

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    // Token expiration or invalid signature handling
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default checkAuth;
