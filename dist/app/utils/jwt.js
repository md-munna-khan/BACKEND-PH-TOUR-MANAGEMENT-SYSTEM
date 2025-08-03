"use strict";
// import { JwtPayload, SignOptions } from "jsonwebtoken";
// import  jwt  from "jsonwebtoken";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    // is to explicitly tell TypeScript that the object { expiresIn } should be treated as a SignOptions type, which is an interface provided by the jsonwebtoken package.
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token, secret) => {
    const verifyToken = jsonwebtoken_1.default.verify(token, secret);
    return verifyToken;
};
exports.verifyToken = verifyToken;
