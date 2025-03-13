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
const express_1 = __importDefault(require("express"));
const twitterScrapper_1 = require("../services/twitterScrapper");
const router = express_1.default.Router();
router.post("/suggest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweet, handle } = req.body;
    if (!tweet || !handle) {
        res.status(400).json({ error: "Missing tweet or handle" });
        return;
    }
    try {
        const username = handle.startsWith("@") ? handle.slice(1) : handle;
        const recentTweets = yield (0, twitterScrapper_1.twitterScrapper)(username, 5);
        const suggestions = [
            `${handle}, ${tweet}? With vibes like "${recentTweets[0] || "this"}", you’re unstoppable!`,
            `Hey ${handle}, ${tweet}—echoing your genius from "${recentTweets[1] || "earlier"}"!`,
            `${handle}, ${tweet} hits hard—keep dropping truth like "${recentTweets[2] || "always"}"!`,
        ];
        res.json({ suggestions });
    }
    catch (error) {
        console.error("Suggestion error:", error);
        res
            .status(500)
            .json({ error: "Failed to generate suggestions", details: error });
    }
}));
exports.default = router;
