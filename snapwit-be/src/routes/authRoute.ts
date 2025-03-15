import express, { Request, Response } from "express";
import { TwitterApi } from "twitter-api-v2";
import session from "express-session";
import { xConfig } from "../config/xConfig";

const router = express.Router();

const twitterClient = new TwitterApi({
  clientId: xConfig.clientId,
  clientSecret: xConfig.clientSecret,
});

router.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

router.get("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      xConfig.callbackUrl,
      { scope: ["tweet.read", "users.read", "offline.access"] }
    );

    req.session.codeVerifier = codeVerifier ?? null;
    req.session.oauthState = state ?? null;

    res.json({ url });
  } catch (error) {
    console.error("OAuth2 Login Error:", error);
    res.status(500).json({ error: "Failed to generate auth link" });
  }
});

router.get("/callback", async (req: Request, res: Response): Promise<void> => {
  const { code, state } = req.query;

  if (!code || !state) {
    res.status(400).json({ error: "Missing authorization code or state" });
    return;
  }

  try {
    const storedCodeVerifier = req.session.codeVerifier;
    const storedState = req.session.oauthState;

    if (!storedCodeVerifier || storedState !== state) {
      throw new Error("Invalid state or missing code verifier");
    }

    const {
      client: loggedClient,
      accessToken,
      refreshToken,
    } = await twitterClient.loginWithOAuth2({
      code: code as string,
      codeVerifier: storedCodeVerifier,
      redirectUri: xConfig.callbackUrl,
    });

    req.session.codeVerifier = undefined;
    req.session.oauthState = undefined;

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("OAuth2 Callback Failed:", error);
    res.status(500).json({ error: "Login Failed" });
  }
});

export default router;
