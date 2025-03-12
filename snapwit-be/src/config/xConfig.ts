import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const xConfig = {
  clientId: process.env.X_CLIENT_ID || "MISSING_CLIENT_ID",
  clientSecret: process.env.X_CLIENT_SECRET,
  callbackUrl:
    process.env.X_REDIRECT_URI || "http://localhost:5000/auth/callback",
  scopes: ["tweet.read", "users.read"],
  port: parseInt(process.env.PORT || "5000", 10),
};
