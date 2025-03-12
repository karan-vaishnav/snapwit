import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { xConfig } from "./config/xConfig";
import authRoute from "./routes/authRoute";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);

app.listen(xConfig.port, () => {
  console.log(`Server running on http://localhost:${xConfig.port}`);
});
