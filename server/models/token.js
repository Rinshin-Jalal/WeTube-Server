import { Entity, Schema } from "redis-om";
import { client } from "../config/redis.js";

class Token extends Entity {}

const tokenSchema = new Schema(
  Token,
  {
    user: {
      type: "string",
    },
    token: {
      type: "string",
    },
    passwordReset: {
      type: "boolean",
    },
  },
  {
    dataStructure: "JSON",
  }
);

export const tokenRepo = client.fetchRepository(tokenSchema);

await tokenRepo.createIndex();
