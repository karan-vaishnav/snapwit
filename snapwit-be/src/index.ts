import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import fetchRoutes from "./routes/fetchRoutes";
import authRoutes from "./routes/authRoute";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
const PORT = process.env.PORT || 5000;

// Centralized Session Middleware (Used for authentication)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.options("*", cors());
app.use("/", fetchRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
