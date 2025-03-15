import express, { Request, Response } from "express";
import { twitterScrapper } from "../services/twitterScrapper";

const router = express.Router();

router.post("/suggest", async (req: Request, res: Response) => {
  const { tweet, handle } = req.body;

  if (!tweet || !handle) {
    res.status(400).json({ error: "Missing tweet or handle" });
    return;
  }

  try {
    const username = handle.startsWith("@") ? handle.slice(1) : handle;
    const recentTweets = await twitterScrapper(username, 5);

    const suggestions = [
      `${handle}, ${tweet}? With vibes like "${
        recentTweets[0] || "this"
      }", you’re unstoppable!`,
      `Hey ${handle}, ${tweet}—echoing your genius from "${
        recentTweets[1] || "earlier"
      }"!`,
      `${handle}, ${tweet} hits hard—keep dropping truth like "${
        recentTweets[2] || "always"
      }"!`,
    ];

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json({ suggestions });
  } catch (error) {
    console.error("Suggestion error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate suggestions", details: error });
  }
});

export default router;
