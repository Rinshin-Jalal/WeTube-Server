import express from "express";
import {
  getVideos,
  setVideos,
  getVideo,
  deleteVideo,
  updateVideo,
} from "../controllers/video.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const videoRouter = express.Router();

videoRouter.get("/", getVideos);
videoRouter.post("/", protect, upload.single("video"), setVideos);
videoRouter.get("/:id", getVideo);
videoRouter.delete("/:id", protect, deleteVideo);
videoRouter.put("/:id", protect, updateVideo);

export default videoRouter;
