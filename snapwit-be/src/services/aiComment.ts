import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

interface AICommentInput {
  tweet: string;
  regen?: boolean;
}

const commentCache: Record<string, string[]> = {};

export async function generateAIComment({
  tweet,
  regen = false,
}: AICommentInput): Promise<string[]> {
  try {
    const cacheKey = tweet;

    if (!regen && commentCache[cacheKey]) {
      console.log("Returning cached AI comments...");
      return commentCache[cacheKey];
    }

    const prompt = `
    Act as the most active and highly engaging Twitter user who understands trends, memes, and user psychology deeply.
  
    You are known for:
    - Posting **highly relevant** and **natural-sounding** replies.
    - Adapting to **current trends** and **situational context**.
    - Engaging like an **experienced Twitter personality** who knows what works.
  
    **Here is a tweet:**
    "${tweet}"
  
    🔥 **Your Task:**
    Generate exactly **three** engaging comments that:
    - Feel like they are written by a **real, active Twitter user**.
    - Match the **tone & context of the tweet**.
    - Adapt to **current trends, memes, and viral discussions**.
    - Feel natural, **not forced or generic**.
    - Avoid responses like "Tweet not found" or "What happened?"
  
    **Also, ensure:**
    - If the tweet is about a festival, acknowledge it in a fun way.
    - If the tweet has a motivational or productivity angle, engage with it accordingly.
    - If the tweet includes a viral/trendy phrase, respond in a way that matches the vibe.
  
    🚀 **Return the response as a JSON array (without markdown or formatting)**:
    ["Comment 1", "Comment 2", "Comment 3"]
  `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    responseText = responseText
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    let comments: string[] = [];

    try {
      comments = JSON.parse(responseText);
      if (!Array.isArray(comments) || comments.length !== 3) {
        throw new Error("Invalid AI response format");
      }
    } catch (error) {
      console.error("AI response format error:", error);
      return ["Couldn't generate valid comments."];
    }

    commentCache[cacheKey] = comments;
    return comments;
  } catch (error) {
    console.error("Error generating AI comment:", error);
    return ["Sorry, I couldn't generate a comment at this time."];
  }
}
