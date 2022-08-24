import express from "express";
import ConnectDB from "./db";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user";

const app = express();
ConnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.json({ msg: "Hello World!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
