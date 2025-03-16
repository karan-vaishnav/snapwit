import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

interface AICommentInput {
  tweet: string;
  regen?: boolean;
}

const commentCache: Record<string, string[]> = {};
const creditCache: Record<string, number> = {};

export async function generateAIComment({
  tweet,
  regen = false,
}: AICommentInput): Promise<{ aiComments: string[]; creditsLeft: number }> {
  try {
    const cacheKey = tweet;

    if (!(cacheKey in creditCache)) {
      creditCache[cacheKey] = 3;
    }

    if (creditCache[cacheKey] <= 0) {
      return {
        aiComments: ["No credits left for this tweet!"],
        creditsLeft: 0,
      };
    }

    creditCache[cacheKey] -= 1;

    if (!regen && commentCache[cacheKey]) {
      return {
        aiComments: commentCache[cacheKey],
        creditsLeft: creditCache[cacheKey],
      };
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
    - **MUST BE UNIQUE**: ${
      regen
        ? "This is a regeneration request. Provide completely new and distinct comments that differ from any previous ones you might have generated for this tweet."
        : "Provide fresh, original comments."
    }
    - To ensure uniqueness, incorporate a random creative twist (e.g., a fresh meme reference, a unique angle, or a spontaneous vibe) each time.

    **Examples of random twists**:
    - Reference a trending meme (e.g., "Is this allowed to be *this* good?").
    - Add a playful spin (e.g., "Me running to tell my mom about this W").
    - Use a unique tone (e.g., hype, sarcasm, or chill vibes).

    **Random seed for uniqueness**: ${Date.now()} (use this to inspire variation)

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
      return {
        aiComments: ["Couldn't generate valid comments."],
        creditsLeft: creditCache[cacheKey],
      };
    }

    commentCache[cacheKey] = comments;

    return { aiComments: comments, creditsLeft: creditCache[cacheKey] };
  } catch (error) {
    return {
      aiComments: ["Sorry, I couldn't generate a comment at this time."],
      creditsLeft: 0,
    };
  }
}
