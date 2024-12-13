"use strict";
// import { findAdmin } from "../../../infrastructure/repositories/mongoAdminRepository";
// import { io } from '../../../server';
// import { Encrypt } from "../../helper/hashPassword";
// import { generateToken } from "../../helper/jwtHelper";
// import { successMessagetoUser } from "../../../infrastructure/repositories/mongoUserRepository";
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
// export default {
//   loginAdmin: async (cred: { email: string; password: string }) => {
//     try {
//       const admin = await findAdmin(cred.email);
//       if (!admin || !admin.password) {
//         throw new Error("Admin not found or password is missing");
//       }
//       const isValid = await Encrypt.comparePassword(
//         cred.password,
//         admin.password
//       );
//       if (!isValid) {
//         throw new Error("Invalid password");
//       }
//       const role = "admin";
//       const tokenData = await generateToken(admin.id, cred.email, role);
//       return {
//         admin,
//         token: tokenData.token,
//         refreshToken: tokenData.refreshToken,
//       };
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error(`Error: ${error.message}`);
//         throw error;
//       } else {
//         console.error("An unknown error occurred");
//         throw new Error("An unknown error occurred");
//       }
//     }
//   },
//   successMessage: async (chatId: string, content: string) => {
//     const newMessage = await successMessagetoUser(chatId, content);
//     io.to(chatId).emit("receiveMessage", newMessage);
//     return newMessage;
//   }
// };
const mongoAdminRepository_1 = __importDefault(require("../../../infrastructure/repositories/mongoAdminRepository"));
const mongoUserRepository_1 = __importDefault(require("../../../infrastructure/repositories/mongoUserRepository"));
const server_1 = require("../../../server");
const hashPassword_1 = require("../../helper/hashPassword");
const jwtHelper_1 = require("../../helper/jwtHelper");
exports.default = {
    /**
     * Login Admin
     * @param cred - Admin credentials
     * @returns Admin details with tokens
     */
    loginAdmin: (cred) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const admin = yield mongoAdminRepository_1.default.findAdmin(cred.email);
            if (!admin || !admin.password) {
                throw new Error("Admin not found or password is missing");
            }
            const isValid = yield hashPassword_1.Encrypt.comparePassword(cred.password, admin.password);
            if (!isValid) {
                throw new Error("Invalid password");
            }
            const role = "admin";
            const tokenData = yield (0, jwtHelper_1.generateToken)(admin.id, cred.email, role);
            return {
                admin,
                token: tokenData.token,
                refreshToken: tokenData.refreshToken,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                throw error;
            }
            else {
                console.error("An unknown error occurred");
                throw new Error("An unknown error occurred");
            }
        }
    }),
    /**
     * Send Success Message
     * @param chatId - Chat room ID
     * @param content - Message content
     * @returns New message
     */
    successMessage: (chatId, content) => __awaiter(void 0, void 0, void 0, function* () {
        const newMessage = yield mongoUserRepository_1.default.successMessagetoUser(chatId, content);
        server_1.io.to(chatId).emit("receiveMessage", newMessage);
        return newMessage;
    })
};
