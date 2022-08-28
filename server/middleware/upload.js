// import { v2 as cloudinary } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "thumbnail")
      return {
        folder: "thumbnails",
      };
    if (file.fieldname === "profile")
      return {
        folder: "profiles",
      };
    return {
      folder: "videos",

      resource_type: "video",
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail" || file.fieldname === "profile") {
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

const upload = multer({ storage: storage, fileFilter });

export default upload;
// app.post("/", upload.single("video"), async (req, res) => {
//   if (!req.file) {
//     return res.json({ msg: "error" });
//   }
//   console.log(JSON.stringify(req.file), "ggggg");
//   console.log("dddddddddddddddd");
//   return res.json({ pic: req.file });
// });
