import { videoRepo } from "../models/video.js";
import getPublicId from "./getPublicId.js";
import cloudinary from "../config/cloudinary.js";

const deleteAVideo = async (video, id) => {
  const thumbnailPublicId = getPublicId(video?.thumbnail);
  const videoPublicId = getPublicId(video?.url);

  await videoRepo.remove(id);

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
};

export default deleteAVideo;
