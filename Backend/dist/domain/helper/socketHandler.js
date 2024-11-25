"use strict";
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Server, Socket } from 'socket.io';
// import mongoose from 'mongoose';
// import MessageModel from '../../infrastructure/database/dbModel/messageModel';
// import ChatModel from '../../infrastructure/database/dbModel/chatModel';
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
const mongoose_1 = __importDefault(require("mongoose"));
const messageModel_1 = __importDefault(require("../../infrastructure/database/dbModel/messageModel"));
const chatModel_1 = __importDefault(require("../../infrastructure/database/dbModel/chatModel"));
// Track online users
const onlineUsers = new Map(); // Map of userId to socketId
const handleSocketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // Event: Join a chat room
        socket.on('join_room', (roomId) => __awaiter(void 0, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
                console.error(`Invalid chat ID: ${roomId}`);
                return;
            }
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        }));
        // Event: User connects
        socket.on('user_connected', (userId) => {
            onlineUsers.set(userId, socket.id);
            io.emit('online_status', { userId, status: 'online' });
            console.log(`User ${userId} is online.`);
        });
        // Event: Admin connects
        socket.on('admin_connected', (adminId) => {
            onlineUsers.set(adminId, socket.id);
            io.emit('online_status', { adminId, status: 'online' });
            console.log(`Admin ${adminId} is online.`);
        });
        // Event: Check online status
        socket.on('get_online_status', ({ userId, adminId }) => {
            const isUserOnline = onlineUsers.has(userId);
            const isAdminOnline = onlineUsers.has(adminId);
            socket.emit('online_status_update', { userId, status: isUserOnline ? 'online' : 'offline' });
            socket.emit('online_status_update', { adminId, status: isAdminOnline ? 'online' : 'offline' });
        });
        // Event: Send a message
        socket.on('sendMessage', (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!data.content.trim()) {
                    console.error('Empty message content');
                    ack === null || ack === void 0 ? void 0 : ack({ success: false, error: 'Message content is empty.' });
                    return;
                }
                const newMessage = new messageModel_1.default({
                    chat: data.chatId,
                    sender: data.sender,
                    senderModel: data.senderModel,
                    content: data.content,
                    createdAt: new Date(),
                });
                const savedMessage = yield newMessage.save();
                // Emit "delivered" status to recipient if online
                const recipientSocketId = onlineUsers.get(data.recipientId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('messageStatusUpdate', {
                        messageId: savedMessage._id,
                        status: 'delivered',
                    });
                }
                // Emit acknowledgment to sender
                ack === null || ack === void 0 ? void 0 : ack({ success: true, messageId: savedMessage._id });
                // Emit the new message to the room
                io.to(data.chatId).emit('receiveMessage', savedMessage);
            }
            catch (error) {
                console.error('Error processing message:', error);
                ack === null || ack === void 0 ? void 0 : ack({ success: false, error: 'Error processing message.' });
            }
        }));
        // Event: Typing indicator
        socket.on('typing', (data) => {
            socket.to(data.roomId).emit('typing', data);
        });
        // Event: Mark messages as read
        socket.on('messageRead', (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatId, userId }) {
            try {
                console.log(chatId, '151555');
                // Update message read status in the database
                yield messageModel_1.default.updateMany({ chat: chatId, sender: { $ne: userId }, read: false }, { $set: { read: true, readAt: new Date() } });
                // Notify room members of the updated messages
                const messages = yield messageModel_1.default.find({ chat: chatId });
                io.to(chatId).emit('messagesUpdated', messages);
                // Reset the unread count for the user in the chat
                yield chatModel_1.default.findByIdAndUpdate(chatId, {
                    $set: { [`unreadCount.${userId}`]: 0 },
                });
                console.log(`Messages in chat ${chatId} marked as read by user ${userId}`);
            }
            catch (error) {
                console.error('Error marking messages as read:', error);
            }
        }));
        // Event: Handle socket disconnect
        socket.on('disconnect', () => {
            var _a;
            const disconnectedId = (_a = [...onlineUsers.entries()].find(([, id]) => id === socket.id)) === null || _a === void 0 ? void 0 : _a[0];
            if (disconnectedId) {
                onlineUsers.delete(disconnectedId);
                io.emit('online_status_update', { userId: disconnectedId, status: 'offline' });
                console.log(`User or Admin with ID ${disconnectedId} went offline.`);
            }
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.default = handleSocketEvents;
