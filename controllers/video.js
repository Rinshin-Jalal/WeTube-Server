import asyncHandler from "express-async-handler";
import videoModel from "../models/video.js";
import userModel from "../models/user.js";
import isEmpty from "../utils/isEmpty.js";

const getVideos = asyncHandler(async (req, res) => {
  const videos = await videoModel.find({ user: req.user.id });

  res.status(200).json(videos);
});

const setVideos = asyncHandler(async (req, res) => {
  const videoURL = req.file.path;
  if (
    isEmpty(req.body.title) ||
    isEmpty(req.body.description || isEmpty(videoURL))
  ) {
    res.status(400);
    throw new Error("Provided title and desc and upload video");
  }

  if (!req.user) {
    res.status(401).json({ msg: "not authorized" });
  }

  const video = await videoModel.create({
    title: req.body.title,
    description: req.body.description,
    url: videoURL,
    user: req.user.id,
    ...(req.body.thumbnail && { thumbnail: req.body.thumbnail }),
  });

  res.status(200).json(video);
});

const getVideo = asyncHandler(async (req, res) => {
  const video = await videoModel.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }

  res.status(200).json(video);
});

const deleteVideo = asyncHandler(async (req, res) => {
  const video = await videoModel.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }

  if (video.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await videoModel.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Video deleted" });
});

const updateVideo = asyncHandler(async (req, res) => {
  const video = await videoModel.findById(req.params.id);

  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }

  if (video.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await videoModel.findByIdAndUpdate(req.params.id, {
    ...(req.body.title && { title: req.body.title }),
    ...(req.body.description && { description: req.body.description }),
    ...(req.body.thumbnail && { thumbnail: req.body.thumbnail }),
  });

  res.status(200).json({ message: "Video updated" });
});

export { getVideos, setVideos, getVideo, deleteVideo, updateVideo };
