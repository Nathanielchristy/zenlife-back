const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not Authorized, Please Login");
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User Not Found");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error);
    res.status(401);
    throw new Error("Not Authorized, Please Login");
  }
});

module.exports = protect;
