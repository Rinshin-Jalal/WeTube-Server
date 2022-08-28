import express from "express";
import {
  registerUser,
  loginUser,
  getYourVideos,
  getUser,
  followUser,
  unfollowUser,
  updateBio,
  requestVerification,
  verifyUser,
  resetPassword,
  changePassword,
} from "../controllers/user.js";
import { protect, isVerified } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getYourVideos);
userRouter.put(
  "/bio",
  protect,
  isVerified,
  upload.single("profile"),
  updateBio
);
userRouter.put("/follow/:id", protect, isVerified, followUser);
userRouter.put("/unfollow/:id", protect, isVerified, unfollowUser);
userRouter.put("/verify/:id/:token", verifyUser);
userRouter.put("/request-verification", protect, requestVerification);
userRouter.get("/:name", getUser);
userRouter.post("/reset-password", resetPassword);
userRouter.put("/reset-password/:id/:token", changePassword);

export default userRouter;
