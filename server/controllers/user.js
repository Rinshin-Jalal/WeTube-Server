import asyncHandler from "express-async-handler";
import { userRepo } from "../models/user.js";
import { videoRepo } from "../models/video.js";
import { tokenRepo } from "../models/token.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import isEmpty from "../utils/isEmpty.js";
import dotenv from "dotenv";
import sendEmail from "../utils/sendMail.js";
import slugify from "slugify";
dotenv.config();
import getPublicId from "../utils/deleteAVideo.js";
import deleteAVideo from "../utils/deleteAVideo.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (isEmpty(name) || isEmpty(email) || isEmpty(password)) {
    res.status(400).json({ msg: "Please enter all fields" });
  }
  const userWithEmailExists = await userRepo
    .search()
    .where("email")
    .equals(email)
    .return.first();

  const userWithUsernameExists = await userRepo
    .search()
    .where("username")
    .equals(name)
    .return.first();

  if (userWithEmailExists) {
    return res.status(400).json({ msg: "User with this email already exists" });
  }
  if (userWithUsernameExists) {
    return res
      .status(400)
      .json({ msg: "User with this username already exists" });
  }
  //   hash the password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  //   create a new user
  const user = await userRepo.createAndSave({
    username: sluged(name),
    email,
    password: hashedPassword,
    isVerified: false,
    profile: `https://ui-avatars.com/api/?name=${name}&background=random&color=random`,
  });

  const token = await tokenRepo.createAndSave({
    user: user.entityId,
    token: generateToken(user.entityId),
  });

  const message = `${process.env.BASE_URL}/user/verify/${user.entityId}/${token.token}`;
  await sendEmail(email, "Verify Email", message);

  res.status(201).json({
    entityId: user.entityId,
    name: user.username,
    email: user.email,
    isVerified: user.isVerified,
    profile: user.profile,
    token: generateToken(user.entityId),
  });
});

const requestVerification = asyncHandler(async (req, res) => {
  let token = await tokenRepo
    .search()
    .where("user")
    .equals(req.user.entityId)
    .return.first();
  if (!token) {
    token = await tokenRepo.createAndSave({
      user: req.user.entityId,
      token: generateToken(req.user.entityId),
    });
  }
  console.log();
  const message = `${process.env.BASE_URL}/api/users/verify/${req.user.entityId}/${token.token}`;
  await sendEmail(req.user.email, "Verify Email", message);
  res.status(200).json({ msg: "Email sent" });
});

const verifyUser = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const tokenFound = await tokenRepo
    .search()
    .where("user")
    .equals(id)
    .where("token")
    .equals(token)
    .return.first();
  if (!tokenFound) {
    return res.status(400).json({ msg: "Token not found" });
  }
  const user = await userRepo.fetch(id);

  if (!user) return res.status(400).json({ msg: "user not found" });

  user.isVerified = true;
  await userRepo.save(user);
  await tokenRepo.remove(tokenFound.entityId);
  res.status(200).json({ msg: "User verified" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const user = await userRepo
    .search()
    .where("email")
    .equal(req.body.email)
    .return.first();

  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  }

  let token = await tokenRepo
    .search()
    .where("user")
    .equals(user.entityId)
    .return.first();
  if (!token) {
    token = await tokenRepo.createAndSave({
      user: user.entityId,
      token: generateToken(user.entityId),
      passwordReset: true,
    });
  }

  const message = `${process.env.BASE_URL}/api/users/reset-password/${user.entityId}/${token.token}`;
  const success = await sendEmail(req.body.email, "Verify Email", message);

  success
    ? res.status(200).json({ msg: "send verification link" })
    : res.status(400).json({ msg: "can't send email" });
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await userRepo.fetch(req.params.id);
  if (!user) return res.status(404).json({ msg: "user not found" });

  const token = await tokenRepo
    .search()
    .where("user")
    .equals(req.params.id)
    .where("token")
    .equals(req.params.token)
    .where("passwordReset")
    .is.true()
    .return.first();

  if (!token) return res.status(404).json({ msg: "token not found" });

  const salt = await bcryptjs.genSalt(10);

  const hashedPassword = await bcryptjs.hash(req.body.password, salt);
  user.password = hashedPassword;
  await userRepo.save(user);

  res.status(200).json({ msg: "password changed" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "Please enter all fields" });
  }

  const user = await userRepo
    .search()
    .where("email")
    .equals(email)
    .return.first();

  if (user && bcryptjs.compareSync(password, user.password)) {
    res.json({
      entityId: user.entityId,
      name: user.username,
      email: user.email,
      token: generateToken(user.entityId),
    });
  } else {
    res.status(400).json({ msg: "Invalid credentials" });
  }
});

const getYourVideos = asyncHandler(async (req, res) => {
  const videos = await videoRepo
    .search()
    .where("user")
    .equals(req.user.entityId)
    .return.all();
  res.status(200).json({
    entityId: req.user.entityId,
    profile: req.user.profile,
    username: req.user.username,
    videos,
  });
});

const updateBio = asyncHandler(async (req, res) => {
  const profile = req?.file?.path;
  const name = req.body.name;
  const user = await userRepo.fetch(req.user.entityId);
  profile && (user.profile = profile);
  name && (user.username = name);
  await userRepo.save(user);

  res.status(200).json({
    entityId: user.entityId,
    profile: user.profile,
    username: sluged(user.username),
  });
});

const getUser = asyncHandler(async (req, res) => {
  console.log(req.params.name);
  const user = await userRepo
    .search()
    .where("username")
    .equals(req.params.name)
    .return.first();
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  const videos = await videoRepo
    .search()
    .where("user")
    .equals(user.entityId)
    .return.all();
  res.status(200).json({
    entityId: user.entityId,
    profile: user.profile,
    username: user.username,
    followers: user.followers && user.followers.length,
    isVerified: user.isVerified,
    videos,
  });
});

const followUser = asyncHandler(async (req, res) => {
  const user = await userRepo.fetch(req.params.id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (user.followers && user.followers.includes(req.user.entityId)) {
    return res.status(400).json({ msg: "You are already following this user" });
  }

  user.followers = user.followUser
    ? [...user.followers, req.user.entityId]
    : [req.user.entityId];
  await userRepo.save(user);
  res.status(200).json({
    msg: "unfollowed user",
    entityId: user.entityId,
    profile: user.profile,
    username: user.username,
    followers: user.followers.length,
  });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const user = await userRepo.fetch(req.params.id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (!user.followers || !user.followers.includes(req.user.entityId)) {
    return res.status(400).json({ msg: "You are not following this user" });
  }

  (user.followers = user.followers.filter((follower) => {
    return follower !== req.user.entityId;
  })),
    await userRepo.save(user);
  res.status(200).json({
    msg: "unfollowed user",
    entityId: user.entityId,
    profile: user.profile,
    username: user.username,
    followers: user.followers.length,
  });
});

// Generate token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const sluged = (name) => {
  return slugify(name, {
    replacement: "_",
    lower: false,
  });
};

export {
  registerUser,
  loginUser,
  getYourVideos,
  getUser,
  followUser,
  unfollowUser,
  updateBio,
  requestVerification,
  verifyUser,
  resetPassword,
  changePassword,
};
