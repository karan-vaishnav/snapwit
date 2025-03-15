import express from "express";
import cors from "cors";
import { xConfig } from "./config/xConfig";
import authRoute from "./routes/authRoute";
import commentRoute from "./routes/commentRoute";

const app = express();

app.use(cors());
app.use(express.json());
// app.use((req, res, next) => {
//   res.setHeader("Content-Type", "application/json; charset=utf-8");
//   next();
// });

app.use("/auth", authRoute);
app.use("/comments", commentRoute);

app.listen(xConfig.port, () => {
  console.log(`Server running on http://localhost:${xConfig.port}`);
});
