import puppeteer from "puppeteer-core";

export async function twitterScraper(tweetUrl: string): Promise<string> {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
      headless: "shell",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
      ],
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
