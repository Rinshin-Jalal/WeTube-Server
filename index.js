import express from "express";
import ConnectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.js";
import cors from "cors";
import videoRouter from "./routes/video.js";

const app = express();
ConnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "Hello World!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// app.post("/", upload.single("video"), async (req, res) => {
//   if (!req.file) {
//     return res.json({ msg: "error" });
//   }
//   console.log(JSON.stringify(req.file), "ggggg");
//   console.log("dddddddddddddddd");
//   return res.json({ pic: req.file });
// });
