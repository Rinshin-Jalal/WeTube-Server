import asyncHandler from "express-async-handler";
import { videoRepo } from "../models/video.js";
import { userRepo } from "../models/user.js";
import { commentRepo } from "../models/comments.js";
import isEmpty from "../utils/isEmpty.js";
import cloudinary from "../config/cloudinary.js";
import { likeVideo } from "./video.js";

// addAComment
const addComment = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const video = await videoRepo.fetch(req.params.video);

  if (!video) {
    return res.status(404).json({ msg: "Video not found" });
  }

  const comment = await commentRepo.createAndSave({
    message,
    user: req.user.entityId,
    video: video.entityId,
  });

  res.status(201).json(comment);
});

//  delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await commentRepo.fetch(req.params.id);
  const video = await videoRepo.fetch(comment.video);

  if (!comment) {
    return res.status(404).json({ msg: "Video not found" });
  }

  if (comment.user !== req.user.entityId || video.user !== req.user.entityId) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  await commentRepo.remove(comment.entityId);

  res.status(200).json({ msg: "comment deleted" });
});

const editComment = asyncHandler(async (req, res) => {
  const comment = await commentRepo.fetch(req.params.id);
  if (!comment) {
    return res.status(404).json({ msg: "Video not found" });
  }

  if (comment.user !== req.user.entityId) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  comment.message = req.body.message;

  await commentRepo.save(comment);

  res.status(201).json(comment);
});

const likeComment = asyncHandler(async (req, res) => {
  const comment = await commentRepo.fetch(req.params.id);

  if (!comment) {
    res.status(404).json({ msg: "comment not found" });
  }

  if (comment.likes && comment.likes.includes(req.user.entityId)) {
    res.status(400).json({ msg: "You already liked this comment" });
  }

  if (comment.dislikes && comment.dislikes.includes(req.user.entityId)) {
    comment.dislikes = comment.dislikes.filter(
      (user) => user !== req.user.entityId
    );
  }
  comment.likes = comment.likes
    ? [...comment.likes, req.user.entityId]
    : [req.user.entityId];

  await commentRepo.save(comment);

  res.status(200).json({ msg: "comment liked", comment });
});

// like a video
const dislikeComment = asyncHandler(async (req, res) => {
  const comment = await commentRepo.fetch(req.params.id);

  if (!comment) {
    res.status(404).json({ msg: "comment not found" });
  }

  if (comment.dislikes && comment.dislikes.includes(req.user.entityId)) {
    res.status(400).json({ msg: "You already disliked this comment" });
  }

  if (comment.likes && comment.likes.includes(req.user.entityId)) {
    comment.likes = comment.likes.filter((user) => user !== req.user.entityId);
  }
  comment.dislikes = comment.dislikes
    ? [...comment.dislikes, req.user.entityId]
    : [req.user.entityId];

  await commentRepo.save(comment);

  res.status(200).json({ msg: "comment disliked", comment });
});

export { addComment, deleteComment, editComment, likeComment, dislikeComment };
