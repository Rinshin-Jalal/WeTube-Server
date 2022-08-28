import express from "express";
import {
  addComment,
  deleteComment,
  editComment,
  likeComment,
  dislikeComment,
} from "../controllers/comments.js";
import { protect, isVerified } from "../middleware/authMiddleware.js";

const commentRouter = express.Router();

commentRouter.post("/:video", protect, isVerified, addComment);
commentRouter.delete("/:id", protect, isVerified, deleteComment);
commentRouter.put("/:id", protect, isVerified, editComment);
commentRouter.put("/like/:id", protect, isVerified, likeComment);
commentRouter.put("/dislike/:id", protect, isVerified, dislikeComment);

export default commentRouter;
