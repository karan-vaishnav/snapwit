import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { createClient, RedisClientType } from "redis";
import connectRedis from "connect-redis";
import fetchRoutes from "./routes/fetchRoutes";
import authRoutes from "./routes/authRoute";
import cors from "cors";

dotenv.config();

const app = express();

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect().catch(console.error);

const { RedisStore } = connectRedis;

app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "https://snapwit.vercel.app"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
const PORT = process.env.PORT || 5000;

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.options("*", cors());
app.use("/", fetchRoutes);
// app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
