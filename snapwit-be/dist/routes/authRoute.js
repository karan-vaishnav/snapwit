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
const express_session_1 = __importDefault(require("express-session"));
const xConfig_1 = require("../config/xConfig");
const router = express_1.default.Router();
const twitterClient = new twitter_api_v2_1.TwitterApi({
    clientId: xConfig_1.xConfig.clientId,
    clientSecret: xConfig_1.xConfig.clientSecret,
});
router.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
router.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(xConfig_1.xConfig.callbackUrl, { scope: ["tweet.read", "users.read", "offline.access"] });
        req.session.codeVerifier = codeVerifier !== null && codeVerifier !== void 0 ? codeVerifier : null;
        req.session.oauthState = state !== null && state !== void 0 ? state : null;
        res.json({ url });
    }
    catch (error) {
        console.error("OAuth2 Login Error:", error);
        res.status(500).json({ error: "Failed to generate auth link" });
    }
}));
router.get("/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, state } = req.query;
    if (!code || !state) {
        res.status(400).json({ error: "Missing authorization code or state" });
        return;
    }
    try {
        const storedCodeVerifier = req.session.codeVerifier;
        const storedState = req.session.oauthState;
        if (!storedCodeVerifier || storedState !== state) {
            throw new Error("Invalid state or missing code verifier");
        }
        const { client: loggedClient, accessToken, refreshToken, } = yield twitterClient.loginWithOAuth2({
            code: code,
            codeVerifier: storedCodeVerifier,
            redirectUri: xConfig_1.xConfig.callbackUrl,
        });
        req.session.codeVerifier = undefined;
        req.session.oauthState = undefined;
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        console.error("OAuth2 Callback Failed:", error);
        res.status(500).json({ error: "Login Failed" });
    }
}));
exports.default = router;
