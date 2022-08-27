import { Client, Entity, Schema, Repository } from "redis-om";

const client = new Client();

const connect = async () => {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
};

class User extends Entity {}

let schema = new Schema(
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
    },
    profile: {
      type: "string",
    },
    videos: {
      type: "string[]",
    },

    //   id:{

    //   }
  },
  {
    dataStructure: "JSON",
  }
);

export async function createCar(data) {
  await connect();

  const repo = new Repository(schema, client);

  const car = repo.createEntity(data);

  const id = await repo.save(car);
  return id;
}
