import express from "express";
// import ConnectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import { ConnectDB } from "./config/redis.js";
import userRouter from "./routes/user.js";
import videoRouter from "./routes/video.js";
import commentRouter from "./routes/comments.js";
import cors from "cors";

const app = express();
ConnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/videos/comments", commentRouter);
app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "Hello World!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
