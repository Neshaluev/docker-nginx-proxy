const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const redis = require("redis");
const session = require("express-session");

let RedisStore = require("connect-redis")(session);

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetray = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log("succesfully connected to DB"))
    .catch(() => {
      console.log("error conneted!!!");
      setTimeout(connectWithRetray, 5000);
    });
};

connectWithRetray();

app.use(express.json());

app.enable("trust proxy");
app.use(cors({}));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      resave: false,
      saveUninitialized: false,
      secure: false,
      httpOnly: true,
      maxAge: 60000,
    },
  })
);

redisClient.on("error", function (error) {
  console.log("ERROR REDIS !!!");
  console.error(error);
});

// Routes
app.get("/api/v1", (req, res) => {
  res.send("<h1> welcome page !!!!</h1>");
});
// localhost:3000/api/v1/posts
app.use("/api/v1/posts", postRouter);
// localhost:3000/api/v1/users/signup
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`server start on port http://localhost:${port}`)
);
