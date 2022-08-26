import express from "express";
import { registerUser, loginUser, getYourVideos } from "../controllers/user.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getYourVideos);

export default userRouter;
