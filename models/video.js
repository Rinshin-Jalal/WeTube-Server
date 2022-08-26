import mongoose from "mongoose";
import shortid from "shortid";

const videoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  thumbnail: {
    type: String,
  },
  url: {
    type: String,
    required: [true, "URL is required"],
  },
  user: {
    type: String,
    ref: "User",
    required: [true, "User is required"],
  },
});

export default mongoose.model("Video", videoSchema);
