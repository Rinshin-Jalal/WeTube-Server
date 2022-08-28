import { Entity, Schema } from "redis-om";
import { client } from "../config/redis.js";

class Comment extends Entity {}

const commentSchema = new Schema(
  Comment,
  {
    user: {
      type: "string",
    },
    message: {
      type: "string",
    },
    video: {
      type: "string",
    },
    likes: {
      type: "string[]",
    },
    dislikes: {
      type: "string[]",
    },
  },
  {
    dataStructure: "JSON",
  }
);

export const commentRepo = client.fetchRepository(commentSchema);

await commentRepo.createIndex();
