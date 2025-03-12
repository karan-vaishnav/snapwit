import * as dotenv from "dotenv";

dotenv.config({  })

export const xConfig = {
  clientId: process.env.X_CLIENT_ID,
  clientSecret: process.env.X_CLIENT_SECRET,
};
