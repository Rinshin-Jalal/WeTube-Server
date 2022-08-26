import asyncHandler from "express-async-handler";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import isEmpty from "../utils/isEmpty.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (isEmpty(name) || isEmpty(email) || isEmpty(password)) {
    res.status(400).json({ msg: "Please enter all fields" });
  }

  //   check if the user is already in the database
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status.json({ msg: "User already exists" });
  }
  //   hash the password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  //   create a new user
  const user = await userModel.create({
    username: name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const user = await userModel.findOne({ email });

  if (user && bcryptjs.compareSync(password, user.password)) {
    res.json({
      _id: user.id,
      name: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export { registerUser, loginUser, getMe };
