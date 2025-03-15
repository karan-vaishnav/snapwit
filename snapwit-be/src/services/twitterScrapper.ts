import puppeteer from "puppeteer";

export async function twitterScrapper(
  username: string,
  count: number = 5
): Promise<string[]> {
  const browser = await puppeteer.launch({
    executablePath: "/snap/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
    ],
  });
  const page = await browser.newPage();

  try {
    console.log(`Scraping tweets for @${username}`);
    await page.goto(`https://x.com/${username}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    console.log("Page loaded");

    await new Promise((resolve) => setTimeout(resolve, 5000)); 
    console.log("Waited for render");

    const tweets = await page
      .$$eval(
        "article div[lang]", 
        (elements, numTweets) => {
          console.log(`Found ${elements.length} tweet elements`);
          return elements.map((el) => el.textContent || "").slice(0, numTweets);
        },
        count
      )
      .catch((err) => {
        console.error("$$eval failed:", err);
        return [];
      });

    console.log(`Scraped tweets: ${JSON.stringify(tweets)}`);
    return tweets.length ? tweets : ["No recent tweets found"];
  } catch (error) {
    console.error(`Failed to scrape @${username}:`, error);
    throw error;
  } finally {
    await browser.close();
  }
}
