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
const twitter_api_v2_1 = require("twitter-api-v2");
const xConfig_1 = require("../config/xConfig");
const router = express_1.default.Router();
const xClient = new twitter_api_v2_1.TwitterApi({ clientId: xConfig_1.xConfig.clientId });
router.get("/login", (req, res) => {
    const authLink = xClient.generateOAuth2AuthLink(xConfig_1.xConfig.callbackUrl, {
        scope: xConfig_1.xConfig.scopes,
    });
    global.codeVerifier = authLink.codeVerifier;
    res.json({ url: authLink.url });
});
router.get("/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    const codeVerifier = global.codeVerifier;
    try {
        const { accessToken } = yield xClient.loginWithOAuth2({
            code: code,
            codeVerifier,
            redirectUri: xConfig_1.xConfig.callbackUrl,
        });
        res.json({
            accessToken,
        });
    }
    catch (e) {
        res.status(500).json({
            error: "Login Failed",
            details: e,
        });
    }
}));
exports.default = router;
