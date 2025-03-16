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
const aiComment_1 = require("../services/aiComment");
const router = express_1.default.Router();
router.post("/comments/suggest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetUrl, regen } = req.body;
        if (!tweetUrl) {
            res.status(400).json({ error: "Tweet URL is required" });
            return;
        }
        const tweet = yield (0, twitterScrapper_1.twitterScraper)(tweetUrl);
        const aiComments = yield (0, aiComment_1.generateAIComment)({ tweet, regen });
        res.json({ aiComments });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to generate AI comment" });
    }
}));
exports.default = router;
