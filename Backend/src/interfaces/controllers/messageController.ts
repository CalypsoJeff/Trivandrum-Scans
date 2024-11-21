import { Request, Response } from "express";
import ChatModel from "../../infrastructure/database/dbModel/chatModel";
import Message from "../../infrastructure/database/dbModel/messageModel";

export default {
    startChat: async (req: Request, res: Response) => {
        const { userId } = req.params;
        const adminId = '66ee588d1e1448fbea1f40bb';

        try {
            let chat = await ChatModel.findOne({ users: { $all: [userId, adminId] } });
            if (!chat) {
                chat = await ChatModel.create({ users: [userId, adminId] });
            }
            res.status(200).json({ success: true, chat });
        } catch (error) {
            console.error('Error starting chat:', error);
            res.status(500).json({ success: false, message: 'Could not start chat' });
        }
    },
    getMessages: async (req: Request, res: Response) => {
        const { chatId } = req.params;
        try {
            const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
            res.status(200).json({ success: true, messages });
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ success: false, message: 'Could not fetch messages' });
        }
    },
};
