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
exports.protectAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const console_1 = require("console");
const adminModel_1 = require("../../../../infrastructure/database/dbModel/adminModel");
const protectAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.header("Authorization");
    // log(token, "tokenadmin");
    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
        // log(token, "tokenWithoutBearer");
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.admin = decoded;
            const adminId = req.admin.user;
            const admin = yield adminModel_1.Admin.findById(adminId);
            (0, console_1.log)("admin found:", admin);
            if (!admin) {
                (0, console_1.log)("admin not found");
                return res.status(401).json({ message: "admin not found" });
            }
            if (req.admin.role === "admin") {
                return next();
            }
            else {
                return res
                    .status(403)
                    .json({ message: "Not authorized, admin role required" });
            }
        }
        catch (error) {
            (0, console_1.log)(error, "JWT verification error");
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(401).json({ message: "Token expired" });
            }
            else {
                return res
                    .status(401)
                    .json({ message: "Not authorized, invalid token" });
            }
        }
    }
    else {
        (0, console_1.log)("No token provided");
        return res.status(401).json({ message: "Not authorized, no token" });
    }
});
exports.protectAdmin = protectAdmin;
