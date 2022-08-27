import asyncHandler from "express-async-handler";
import videoModel from "../models/video.js";
import userModel from "../models/user.js";
import isEmpty from "../utils/isEmpty.js";
import getPublicId from "../utils/getPublicId.js";
import cloudinary from "../config/cloudinary.js";

const getVideos = asyncHandler(async (req, res) => {
  const videos = await videoModel.find({});

  res.status(200).json(videos);
});

const setVideos = asyncHandler(async (req, res) => {
  const videoURL = req.files?.video?.[0]?.path;

  const thumbnail = req.files?.thumbnail?.[0]?.path;
  if (
    isEmpty(req.body.title) ||
    isEmpty(req.body.description || isEmpty(videoURL))
  ) {
    res.status(400).json({ msg: "Provided title and desc and upload video" });
  }

  if (!req.user) {
    res.status(401).json({ msg: "not authorized" });
  }

  const video = await videoModel.create({
    title: req.body.title,
    description: req.body.description,
    url: videoURL,
    user: req.user.id,
    ...(thumbnail && { thumbnail: thumbnail }),
  });

  res.status(200).json(video);
});

const getVideo = asyncHandler(async (req, res) => {
  const video = await videoModel.findById(req.params.id);

  if (!video) {
    res.status(404).json({ msg: "video not found" });
  }

  res.status(200).json(video);
});

const deleteVideo = asyncHandler(async (req, res) => {
  const video = await videoModel.findById(req.params.id);

  if (!video) {
    res.status(404).json({ msg: "video not found" });
  }

  if (video.user.toString() !== req.user.id) {
    res.status(401).json({ msg: "Not authorized" });
  }

  const thumbnailPublicId = getPublicId(video.thumbnail);
  const videoPublicId = getPublicId(video.url);

  await videoModel.findByIdAndDelete(req.params.id);

  cloudinary.uploader.destroy(
    `videos/${videoPublicId}`,
    {
      resource_type: "video",
    },
    (error, result) => {
      result.result === "ok" && console.log("🙌");
      error && console.log(error);
    }
  );

  cloudinary.uploader.destroy(
    `thumbnails/${thumbnailPublicId}`,
    (error, result) => {
      result.result === "ok" && console.log("🙌");
      error && console.log(error);
    }
  );

  res.status(200).json({ message: "Video deleted" });
});

const updateVideo = asyncHandler(async (req, res) => {
  const video = await videoModel.findById(req.params.id);
  const newThumbnailUrl = req.file?.path;

  if (!video) {
    res.status(404).json({ msg: "video not found" });
  }

  if (video.user.toString() !== req.user.id) {
    res.status(401);
    res.status(401).json({ msg: "Not authorized" });
  }

  if (video.thumbnail && newThumbnailUrl) {
    const thumbnailPublicId = getPublicId(video.thumbnail);

    cloudinary.uploader.destroy(
      `thumbnails/${thumbnailPublicId}`,
      (error, result) => {
        result.result === "ok" && console.log("🙌");
        error && console.log(error);
      }
    );
  }

  const updatedVideo = await videoModel.findByIdAndUpdate(
    req.params.id,
    {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.description && { description: req.body.description }),
      ...(newThumbnailUrl && { thumbnail: newThumbnailUrl }),
    },
    {
      new: true,
    }
  );

  res.status(200).json({ msg: "Video updated", video: updatedVideo });
});

export { getVideos, setVideos, getVideo, deleteVideo, updateVideo };
