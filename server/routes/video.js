import express from "express";
import {
  getVideos,
  setVideos,
  getVideo,
  deleteVideo,
  updateVideo,
  likeVideo,
  dislikeVideo,
} from "../controllers/video.js";
import upload from "../middleware/upload.js";
import { protect, isVerified } from "../middleware/authMiddleware.js";

const videoRouter = express.Router();

videoRouter.get("/", getVideos);
videoRouter.post(
  "/",
  protect,
  isVerified,
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
isVerified,
  isVerified,
  videoRouter.delete("/:id", protect, isVerified, deleteVideo);
videoRouter.put(
  "/:id",
  protect,
  upload.single("thumbnail"),
  isVerified,
  updateVideo
);
videoRouter.put("/like/:id", protect, isVerified, likeVideo);
videoRouter.put("/dislike/:id", protect, isVerified, dislikeVideo);

export default videoRouter;
