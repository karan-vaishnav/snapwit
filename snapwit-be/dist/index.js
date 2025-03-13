"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const xConfig_1 = require("./config/xConfig");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", authRoute_1.default);
app.use("/comments", commentRoute_1.default);
app.listen(xConfig_1.xConfig.port, () => {
    console.log(`Server running on http://localhost:${xConfig_1.xConfig.port}`);
});
