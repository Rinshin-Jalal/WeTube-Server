import asyncHandler from "express-async-handler";
import { videoRepo } from "../models/video.js";
import { userRepo } from "../models/user.js";
import isEmpty from "../utils/isEmpty.js";
// import  from "../utils/.js";
import cloudinary from "../config/cloudinary.js";
import shortid from "shortid";
import deleteAVideo from "../utils/deleteAVideo.js";

const getVideos = asyncHandler(async (req, res) => {
  let offset = 1;
  let count = 20;
  let videos = await videoRepo.search().return.page(offset, count);

  videos = getJSObject(videos);

  const videosWithAuthor = await Promise.all(
    videos.map(async (obj) => {
      const author = await userRepo.fetch(obj.user);
      return {
        ...obj,
        authorName: author.username,
        authorProfile: author.profile,
        authorFollowers: author.followers?.length,
      };
    })
  );

  res.status(200).json(videosWithAuthor);
});

const searchVideo = asyncHandler(async (req, res) => {
  const videos = await videoRepo
    .search()
    .where("title")
    .matches(req.params.text)
    .or("description")
    .matches(req.params.text)
    .return.all();

  if (!videos) return res.status(404).json({ msg: "no matching videos lol" });

  res.status(200).json(videos);
});

const setVideos = asyncHandler(async (req, res) => {
  const videoURL = req.files?.video?.[0]?.path;

  if (!videoURL || !req.body.title || !req.body.description)
    return res
      .status(400)
      .json({ msg: "Provided title and desc and upload video" });

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

  const video = await videoRepo.createAndSave({
    title: req.body.title,
    description: req.body.description,
    url: videoURL,
    user: req.user.entityId,
    _id: shortid.generate(),
    createdAt: new Date(),
    ...(thumbnail && { thumbnail: thumbnail }),
  });

  const user = await userRepo.fetch(req.user.entityId);
  user.videos = user.videos
    ? [...user.videos, video.entityId]
    : [video.entityId];
  // const
  await userRepo.save(user);

  res.status(200).json(video);
});

const getVideo = asyncHandler(async (req, res) => {
  const video = await videoRepo
    .search()
    .where("_id")
    .equals(req.params.id)
    .return.first();
  const author = await userRepo.fetch(video.user);

  if (!video) {
    res.status(404).json({ msg: "video not found" });
  }

  res.status(200).json({ video, author });
});

const deleteVideo = asyncHandler(async (req, res) => {
  const video = await videoRepo.fetch(req.params.id);

  if (!video) {
    return res.status(404).json({ msg: "video not found" });
  }

  if (video.user !== req.user.entityId) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  await deleteAVideo(video, req.params.id);

  res.status(200).json({ message: "Video deleted" });
});

const updateVideo = asyncHandler(async (req, res) => {
  const video = await videoRepo.fetch(req.params.id);
  const newThumbnailUrl = req.file?.path;

  if (!video) {
    res.status(404).json({ msg: "video not found" });
  }

  if (video.user !== req.user.entityId) {
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

  req.body.title && (video.title = req.body.title);
  req.body.description && (video.description = req.body.description);
  req.body.thumbnail && (video.thumbnail = req.body.thumbnail);

  await videoRepo.save(video);

  res.status(200).json({ msg: "Video updated", video });
});

// like a video
const likeVideo = asyncHandler(async (req, res) => {
  const video = await videoRepo.fetch(req.params.id);

  if (!video) {
    res.status(404).json({ msg: "video not found" });
  }

  if (video.likes && video.likes.includes(req.user.entityId)) {
    res.status(400).json({ msg: "You already liked this video" });
  }

  if (video.dislikes && video.dislikes.includes(req.user.entityId)) {
    video.dislikes = video.dislikes.filter(
      (user) => user !== req.user.entityId
    );
  }
  video.likes = video.likes
    ? [...video.likes, req.user.entityId]
    : [req.user.entityId];

  await videoRepo.save(video);

  res.status(200).json({ msg: "Video liked", video });
});

// like a video
const dislikeVideo = asyncHandler(async (req, res) => {
  const video = await videoRepo.fetch(req.params.id);

  if (!video) {
    res.status(404).json({ msg: "video not found" });
  }

  if (video.dislikes && video.dislikes.includes(req.user.entityId)) {
    res.status(400).json({ msg: "You already disliked this video" });
  }

  if (video.likes && video.likes.includes(req.user.entityId)) {
    video.likes = video.likes.filter((user) => user !== req.user.entityId);
  }
  video.dislikes = video.dislikes
    ? [...video.dislikes, req.user.entityId]
    : [req.user.entityId];

  await videoRepo.save(video);

  res.status(200).json({ msg: "Video disliked", video });
});

const getJSObject = (data) => {
  data = JSON.stringify(data);
  data = JSON.parse(data);
  return data;
};

export {
  getVideos,
  setVideos,
  getVideo,
  deleteVideo,
  updateVideo,
  likeVideo,
  dislikeVideo,
};
