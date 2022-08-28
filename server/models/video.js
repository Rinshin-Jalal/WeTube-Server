import { Entity, Schema } from "redis-om";
import { client } from "../config/redis.js";

class Video extends Entity {}

const videoSchema = new Schema(
  Video,
  {
    _id: {
      type: "string",
    },
    title: {
      type: "string",
    },
    description: {
      type: "string",
    },
    thumbnail: {
      type: "string",
    },
    url: {
      type: "string",
    },
    user: {
      type: "string",
    },
    likes: {
      type: "string[]",
    },
    dislikes: {
      type: "string[]",
    },
    comments: {
      type: "string[]",
    },
  },
  {
    dataStructure: "JSON",
  }
);

/* use the client to create a Repository just for Persons */
export const videoRepo = client.fetchRepository(videoSchema);

/* create the index for Person */
await videoRepo.createIndex();
