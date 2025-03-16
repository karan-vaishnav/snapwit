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
exports.twitterScraper = twitterScraper;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
function twitterScraper(tweetUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let browser;
        try {
            const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium";
            browser = yield puppeteer_core_1.default.launch({
                executablePath,
                headless: "shell",
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--single-process",
                ],
            });
            const page = yield browser.newPage();
            yield page.goto(tweetUrl, { waitUntil: "networkidle2", timeout: 60000 });
            const tweetText = yield page
                .$eval('article [data-testid="tweetText"]', (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; })
                .catch(() => __awaiter(this, void 0, void 0, function* () {
                return yield page
                    .$eval("article div[lang]", (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; })
                    .catch(() => "");
            }));
            if (!tweetText) {
                throw new Error("Tweet content not found.");
            }
            return tweetText;
        }
        catch (error) {
            return "Error retrieving tweet content.";
        }
        finally {
            if (browser)
                yield browser.close();
        }
    });
}
