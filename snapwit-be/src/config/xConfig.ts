import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["X_CLIENT_ID", "X_CLIENT_SECRET", "X_REDIRECT_URI"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const xConfig = {
  clientId: process.env.X_CLIENT_ID!,
  clientSecret: process.env.X_CLIENT_SECRET!,
  callbackUrl: process.env.X_REDIRECT_URI!,
  scopes: ["tweet.read", "users.read"],
  port: parseInt(process.env.PORT || "5000", 10),
};
