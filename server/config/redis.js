import { Client } from "redis-om";
import dotenv from "dotenv";
dotenv.config();

/* pulls the Redis URL from .env */
const url = process.env.REDIS_URL;

export const client = new Client();

export async function ConnectDB() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
    console.log("connected to redis");
  }
}

ConnectDB();
