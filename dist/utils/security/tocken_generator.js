"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gen_token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const gen_token = (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set.');
    }
    const secretKey = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
};
exports.gen_token = gen_token;
