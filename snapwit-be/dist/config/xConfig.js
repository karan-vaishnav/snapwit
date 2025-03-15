"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVars = ["X_CLIENT_ID", "X_CLIENT_SECRET", "X_REDIRECT_URI"];
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});
exports.xConfig = {
    clientId: process.env.X_CLIENT_ID,
    clientSecret: process.env.X_CLIENT_SECRET,
    callbackUrl: process.env.X_REDIRECT_URI,
    scopes: ["tweet.read", "users.read"],
    port: parseInt(process.env.PORT || "5000", 10),
};
