import express from "express";
import { TwitterApi } from "twitter-api-v2";
import { xConfig } from "../config/xConfig";

const router = express.Router();

const xClient = new TwitterApi({ clientId: xConfig.clientId });

router.get("/login", (req, res) => {
  const authLink = xClient.generateOAuth2AuthLink(xConfig.callbackUrl, {
    scope: xConfig.scopes,
  });
  (global as any).codeVerifier = authLink.codeVerifier;
  res.json({ url: authLink.url });
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const codeVerifier = (global as any).codeVerifier;

  try {
    const { accessToken } = await xClient.loginWithOAuth2({
      code: code as string,
      codeVerifier,
      redirectUri: xConfig.callbackUrl,
    });
    res.json({
      accessToken,
    });
  } catch (e) {
    res.status(500).json({
      error: "Login Failed",
      details: e,
    });
  }
});

export default router;
