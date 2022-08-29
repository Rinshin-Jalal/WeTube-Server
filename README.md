# WeTube Server 🌐
![logo](https://user-images.githubusercontent.com/88965873/187291172-7ff9d441-ad3c-4971-9b56-bcdfb2e9d247.png)

 WeTube Server - The backend of WeTube, an OpenSource YouTube clone.
 
This project has been in my plans🗂️ for about a year.

At the same time I started this two days ago, I received an email about the hackathon, and

I attempted to build it using redis and express


Accessible Routes 👇‍

![Accessible Routes](https://user-images.githubusercontent.com/88965873/187291449-4930e34c-1846-46ff-8bad-11b69a86e78f.png)

Screenshot of Frontend (not completed) 👇‍
![image](https://user-images.githubusercontent.com/88965873/187292361-e0eb484b-d866-4835-8636-2e05a9d093ab.png)

---
### live demo (server) - https://wetube-server-production.up.railway.app



## How it works


### How the data is stored:

For the development, I used the `Redis-OM node`. 
There are 4 different schemas: the User, Token, Video, and Comment Schemas.

#### 1. `User` schema :  

  -  entityID: string
  -  email: string
  -  username: string
  -  password: number
  -  profile: string
  -  followers: string[]
  -  isVerified: boolean
  -  videos: string[]

The `entityId` and `username` are indexed here, allowing us to find users by entityId and username. 

#### 2. `Token` schema : 

- entityId: string
- user: string
- token: string
- passwordReset: boolean

This was used to store the password reset and email verification tokens.
So `everything` is indexed. 

#### 3. `Video` schema :

- entityId: string
- _id: string
- token: string
- description: boolean
- thumbnail: string
- url: string
- user: string
- createdAt: date
- likes: string[]
- dislikes: string[]
- comments: string[]

here, the `_id` - short id and `user`are primarily indexed, so we can find videos with _id and user. 

#### 4. `Comments` schema

- entityId: string
- message: string
- video: string
- likes: string[]
- dislikes: string[]
- user: string

here, the `video` is primarily indexed, so we can find comments of a certain video. 



### How the data is accessed:

It is very simple to access the data using `redis-om`. There are many requests in the server; here are some of the most important ones. 

- Get user using `email` address - `loginUser` controller
```js
  const user = await userRepo
    .search()
    .where("email")
    .equals(email)
    .return.first();
 ```
 
 - Get all videos of a user - `getUser` controller
 ```js
   const videos = await videoRepo
    .search()
    .where("user")
    .equals(user.entityId)
    .return.all();
```

- Get a token using a specific `user`, `token`, and `passwordReset` is true - `changePassword` controller
```js
  const token = await tokenRepo
    .search()
    .where("user")
    .equals(req.params.id)
    .where("token")
    .equals(req.params.token)
    .where("passwordReset")
    .is.true()
    .return.first();
```

- Get a video based on it's `_id` - `getVideo` controller 
```js
  const video = await videoRepo
    .search()
    .where("_id")
    .equals(req.params.id)
    .return.first();
```


## How to run it locally?

### Prerequisites

- Node - v16
- NPM

### Local installation

1. clone the repo
```
git clone https://github.com/Rinshin-Jalal/WeTube-Server
```
2. install packages
```
cd WeTube-Server/server
npm i
```
3. setup environmental variables
```
PORT=6521
JWT_SECRET

// Cloudinary setup
CLOUD_NAME
CLOUD_API_KEY
CLOUD_API_SECRET

// Redis setup
REDIS_URL

// nodemailer setup
EMAIL
HOST
PASS
BASE_URL
MAIL_PORT
```
4. Run 
```
npm start
```

## More Information about Redis Stack

Here some resources to help you quickly get started using Redis Stack. If you still have questions, feel free to ask them in the [Redis Discord](https://discord.gg/redis) or on [Twitter](https://twitter.com/redisinc).

### Getting Started

1. Sign up for a [free Redis Cloud account using this link](https://redis.info/try-free-dev-to) and use the [Redis Stack database in the cloud](https://developer.redis.com/create/rediscloud).
1. Based on the language/framework you want to use, you will find the following client libraries:
    - [Redis OM .NET (C#)](https://github.com/redis/redis-om-dotnet)
        - Watch this [getting started video](https://www.youtube.com/watch?v=ZHPXKrJCYNA)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-dotnet/)
    - [Redis OM Node (JS)](https://github.com/redis/redis-om-node)
        - Watch this [getting started video](https://www.youtube.com/watch?v=KUfufrwpBkM)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-node/)
    - [Redis OM Python](https://github.com/redis/redis-om-python)
        - Watch this [getting started video](https://www.youtube.com/watch?v=PPT1FElAS84)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-python/)
    - [Redis OM Spring (Java)](https://github.com/redis/redis-om-spring)
        - Watch this [getting started video](https://www.youtube.com/watch?v=YhQX8pHy3hk)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-spring/)

The above videos and guides should be enough to get you started in your desired language/framework. From there you can expand and develop your app. Use the resources below to help guide you further:

1. [Developer Hub](https://redis.info/devhub) - The main developer page for Redis, where you can find information on building using Redis with sample projects, guides, and tutorials.
1. [Redis Stack getting started page](https://redis.io/docs/stack/) - Lists all the Redis Stack features. From there you can find relevant docs and tutorials for all the capabilities of Redis Stack.
1. [Redis Rediscover](https://redis.com/rediscover/) - Provides use-cases for Redis as well as real-world examples and educational material
1. [RedisInsight - Desktop GUI tool](https://redis.info/redisinsight) - Use this to connect to Redis to visually see the data. It also has a CLI inside it that lets you send Redis CLI commands. It also has a profiler so you can see commands that are run on your Redis instance in real-time
1. Youtube Videos
    - [Official Redis Youtube channel](https://redis.info/youtube)
    - [Redis Stack videos](https://www.youtube.com/watch?v=LaiQFZ5bXaM&list=PL83Wfqi-zYZFIQyTMUU6X7rPW2kVV-Ppb) - Help you get started modeling data, using Redis OM, and exploring Redis Stack
    - [Redis Stack Real-Time Stock App](https://www.youtube.com/watch?v=mUNFvyrsl8Q) from Ahmad Bazzi
    - [Build a Fullstack Next.js app](https://www.youtube.com/watch?v=DOIWQddRD5M) with Fireship.io
    - [Microservices with Redis Course](https://www.youtube.com/watch?v=Cy9fAvsXGZA) by Scalable Scripts on freeCodeCamp
