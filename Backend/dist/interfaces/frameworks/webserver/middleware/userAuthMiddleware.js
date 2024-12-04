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
exports.protectUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../../../../infrastructure/database/dbModel/userModel");
const protectUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.header("Authorization");
    console.log(token, "token123");
    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
        console.log(token, "tokenWithoutBearer");
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log(decoded, "decoded");
            req.user = decoded;
            const userId = req.user.user;
            console.log(userId, "userId");
            const user = yield userModel_1.Users.findById(userId);
            console.log("User found:", user);
            if (!user) {
                console.log("User not found");
                res.status(401).json({ message: "User not found" });
                return;
            }
            if (user.is_blocked) {
                console.log("User is blocked");
                res.status(403).json({ message: "User is blocked" });
                return;
            }
            if ((req.user.role === "user")) {
                next();
            }
        }
        catch (error) {
            console.log(error, "JWT verification error");
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({ message: "Token expired" });
            }
            else {
                res.status(401).json({ message: "Not authorized, invalid token" });
            }
        }
    }
    else {
        console.log("No token provided");
        res.status(401).json({ message: "Not authorized, no token" });
    }
});
exports.protectUser = protectUser;
