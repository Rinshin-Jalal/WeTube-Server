import { Entity, Schema } from "redis-om";
import { client } from "../config/redis.js";

class User extends Entity {}

const userSchema = new Schema(
  User,
  {
    username: {
      type: "string",
    },
    email: {
      type: "string",
    },
    password: {
      type: "string",
      indexed: false,
    },
    profile: {
      type: "string",
      indexed: false,
    },
    followers: {
      type: "string[]",
    },
    isVerified: {
      type: "boolean",
    },
    videos: {
      type: "string[]",
    },
  },
  {
    dataStructure: "JSON",
  }
);

export const userRepo = client.fetchRepository(userSchema);

await userRepo.createIndex();

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: [true, "Username is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//     },
//     profile: {
//       type: String,
//     },
//     videos: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Video",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);
