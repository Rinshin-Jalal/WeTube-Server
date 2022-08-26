import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "thumbnail")
      return {
        folder: "thumbnails",
      };
    return {
      folder: "videos",

      resource_type: "video",
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail") {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  if (file.fieldname === "video") {
    if (
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/webm" ||
      file.mimetype === "image/mov"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
};

// file upload mp4

const upload = multer({ storage: storage });

export default upload;
