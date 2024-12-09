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
const chatModel_1 = __importDefault(require("../../infrastructure/database/dbModel/chatModel"));
const messageModel_1 = __importDefault(require("../../infrastructure/database/dbModel/messageModel"));
exports.default = {
    startChat: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const adminId = '66ee588d1e1448fbea1f40bb';
        try {
            let chat = yield chatModel_1.default.findOne({ users: { $all: [userId, adminId] } });
            if (!chat) {
                chat = yield chatModel_1.default.create({ users: [userId, adminId] });
            }
            res.status(200).json({ success: true, chat });
        }
        catch (error) {
            console.error('Error starting chat:', error);
            res.status(500).json({ success: false, message: 'Could not start chat' });
        }
    }),
    getMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId } = req.params;
        try {
            const messages = yield messageModel_1.default.find({ chat: chatId }).sort({ createdAt: 1 });
            res.status(200).json({ success: true, messages });
        }
        catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ success: false, message: 'Could not fetch messages' });
        }
    }),
};
