import express, { Request, Response } from "express";
import { twitterScraper } from "../services/twitterScrapper";
import { generateAIComment } from "../services/aiComment";

const router = express.Router();

router.post(
  "/comments/suggest",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { tweetUrl, regen } = req.body;

      if (!tweetUrl) {
        res.status(400).json({ error: "Tweet URL is required" });
        return;
      }

      const tweet = await twitterScraper(tweetUrl);
      const aiComments = await generateAIComment({ tweet, regen });

      res.json({ aiComments });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate AI comment" });
    }
  }
);

export default router;
