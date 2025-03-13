"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterScrapper = twitterScrapper;
const puppeteer_1 = __importDefault(require("puppeteer"));
function twitterScrapper(username_1) {
    return __awaiter(this, arguments, void 0, function* (username, count = 5) {
        const browser = yield puppeteer_1.default.launch({
            executablePath: "/usr/bin/chromium-browser", // Use system Chromium
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // WSL compatibility
        });
        const page = yield browser.newPage();
        try {
            console.log(`Scraping tweets for @${username}`);
            yield page.goto(`https://x.com/${username}`, { waitUntil: "networkidle2" });
            console.log("Page loaded");
            const tweets = yield page.$$eval('[data-testid="tweetText"]', (elements, numTweets) => {
                console.log(`Found ${elements.length} tweet elements`);
                return elements.map((el) => el.textContent || "").slice(0, numTweets);
            }, count);
            console.log(`Scraped tweets: ${tweets}`);
            return tweets;
        }
        catch (error) {
            console.error(`Failed to scrape @${username}:`, error);
            throw error; // Re-throw to catch in route
        }
        finally {
            yield browser.close();
        }
    });
}
