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
const adminInteractor_1 = __importDefault(require("../../domain/useCases/auth/adminInteractor"));
exports.default = {
    // ##-USER--##//
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
    // ##-ADMIN--##//
    getActiveChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { adminId } = req.params;
            console.log(adminId, 'adminId for active chats');
            const activeChats = yield chatModel_1.default.find({
                users: adminId,
            })
                .populate('users', 'name') // Populate to get names of users in the chat
                .populate('latestMessage'); // Populate latest message details
            console.log(activeChats, 'activeChats for admin');
            res.status(200).json(activeChats);
        }
        catch (error) {
            console.error('Error fetching active chats for admin:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
    getMessagesAdmin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId } = req.params;
        try {
            const messages = yield messageModel_1.default.find({ chat: chatId })
                .populate('sender', 'name')
                .sort({ createdAt: 1 }); // Sort messages by creation time
            res.json(messages);
        }
        catch (error) {
            console.error('Error fetching messages for chat:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
    getChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chats = yield chatModel_1.default.find({})
                .populate({ path: "users", select: "name" })
                .populate({
                path: "latestMessage",
                select: "content createdAt",
            })
                .sort({ "latestMessage.createdAt": -1 })
                .exec();
            res.status(200).json({ chats });
        }
        catch (error) {
            console.error("Error fetching chats:", error);
            res.status(500).json({ message: "Server error during chat retrieval" });
        }
    }),
    getChatLists: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chats = yield chatModel_1.default.find()
                .populate('users', 'name')
                .populate('latestMessage', 'content createdAt')
                .sort({ 'latestMessage.createdAt': -1 });
            res.status(200).json(chats);
        }
        catch (error) {
            console.error("Error fetching chat list:", error);
            res.status(500).json({ message: "Server error fetching chat list" });
        }
    }),
    successMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId } = req.params;
        const { content } = req.body;
        try {
            const newMessage = yield adminInteractor_1.default.successMessage(chatId, content);
            res.status(200).json({ message: "Message sent successfully", newMessage });
        }
        catch (error) {
            console.error("Error sending success message:", error);
            res.status(500).json({ message: "Failed to send message" });
        }
    }),
};
