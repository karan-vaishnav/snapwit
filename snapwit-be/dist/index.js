"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
// import Redis from "redis";
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const fetchRoutes_1 = __importDefault(require("./routes/fetchRoutes"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect().catch(console.error);
// const RedisStore = connectRedis(session);
// console.log(typeof RedisStore);
const { RedisStore } = connect_redis_1.default;
console.log(typeof RedisStore);
app.use((0, cors_1.default)({
    origin: ["http://127.0.0.1:5173", "https://snapwit.vercel.app"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));
const PORT = process.env.PORT || 5000;
app.use((0, express_session_1.default)({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use(express_1.default.json());
app.options("*", (0, cors_1.default)());
app.use("/", fetchRoutes_1.default);
app.use("/auth", authRoute_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
