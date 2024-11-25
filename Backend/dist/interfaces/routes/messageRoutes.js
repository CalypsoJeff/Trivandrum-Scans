"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = __importDefault(require("../controllers/messageController"));
const messageRouter = (0, express_1.Router)();
// Route to start a chat between User and Admin
messageRouter.get('/chat/start/:userId', messageController_1.default.startChat);
// Route to get all messages in a chat
messageRouter.get('/chat/:chatId/messages', messageController_1.default.getMessages);
exports.default = messageRouter;
