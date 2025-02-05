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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
require('dotenv').config();
const generateToken = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userid, res }) {
    const jwtToken = process.env.JWT_TOKEN;
    if (jwtToken) {
        const token = yield (0, jsonwebtoken_1.sign)({ userid }, jwtToken, {
            expiresIn: '20d',
        });
        res.cookie("rck", token, {
            maxAge: 20 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });
    }
});
exports.generateToken = generateToken;
