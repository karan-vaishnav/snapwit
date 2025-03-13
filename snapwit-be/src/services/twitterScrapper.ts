import puppeteer from "puppeteer";

export async function twitterScrapper(
  username: string,
  count: number = 5
): Promise<string[]> {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium-browser", // Use system Chromium
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // WSL compatibility
  });
  const page = await browser.newPage();

  try {
    console.log(`Scraping tweets for @${username}`);
    await page.goto(`https://x.com/${username}`, { waitUntil: "networkidle2" });
    console.log("Page loaded");

    const tweets = await page.$$eval(
      '[data-testid="tweetText"]',
      (elements, numTweets) => {
        console.log(`Found ${elements.length} tweet elements`);
        return elements.map((el) => el.textContent || "").slice(0, numTweets);
      },
      count
    );

    console.log(`Scraped tweets: ${tweets}`);
    return tweets;
  } catch (error) {
    console.error(`Failed to scrape @${username}:`, error);
    throw error; // Re-throw to catch in route
  } finally {
    await browser.close();
  }
}
