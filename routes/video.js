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
videoRouter.post(
  "/",
  protect,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  setVideos
);
videoRouter.get("/:id", getVideo);
videoRouter.delete("/:id", protect, deleteVideo);
videoRouter.put("/:id", protect, upload.single("thumbnail"), updateVideo);

export default videoRouter;
