import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { userRepo } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await userRepo.fetch(decoded.id);

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

const isVerified = asyncHandler(async (req, res, next) => {
  const user = await userRepo.fetch(req.user.entityId);
  if (user.isVerified) {
    next();
  } else {
    res.status(401).json({ msg: "Please verify your account" });
  }
});

export { protect, isVerified };
