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
            executablePath: "/snap/bin/chromium",
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--single-process",
            ],
        });
        const page = yield browser.newPage();
        try {
            console.log(`Scraping tweets for @${username}`);
            yield page.goto(`https://x.com/${username}`, {
                waitUntil: "networkidle2",
                timeout: 60000,
            });
            console.log("Page loaded");
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            console.log("Waited for render");
            const tweets = yield page
                .$$eval("article div[lang]", (elements, numTweets) => {
                console.log(`Found ${elements.length} tweet elements`);
                return elements.map((el) => el.textContent || "").slice(0, numTweets);
            }, count)
                .catch((err) => {
                console.error("$$eval failed:", err);
                return [];
            });
            console.log(`Scraped tweets: ${JSON.stringify(tweets)}`);
            return tweets.length ? tweets : ["No recent tweets found"];
        }
        catch (error) {
            console.error(`Failed to scrape @${username}:`, error);
            throw error;
        }
        finally {
            yield browser.close();
        }
    });
}
