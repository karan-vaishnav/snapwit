import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export async function twitterScraper(tweetUrl: string): Promise<string> {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(tweetUrl, { waitUntil: "networkidle2", timeout: 60000 });

    const tweetText = await page
      .$eval("article div[lang]", (el) => el.textContent?.trim() || "")
      .catch(() => "");

    await browser.close();

    if (!tweetText) {
      throw new Error("Tweet content not found.");
    }

    return tweetText;
  } catch (error) {
    console.error("Error scraping tweet:", error);
    return "Error retrieving tweet content.";
  } finally {
    if (browser) await browser.close();
  }
}
