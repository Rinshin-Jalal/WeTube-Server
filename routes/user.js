import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/user.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getMe);

export default userRouter;
