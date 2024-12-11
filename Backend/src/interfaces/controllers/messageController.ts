import { Request, Response } from "express";
import ChatModel from "../../infrastructure/database/dbModel/chatModel";
import Message from "../../infrastructure/database/dbModel/messageModel";
import adminInteractor from "../../domain/useCases/auth/adminInteractor";
export default {
    // ##-USER--##//

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

    // ##-ADMIN--##//

    getActiveChats: async (req: Request, res: Response) => {
        try {
            const { adminId } = req.params;
            console.log(adminId, 'adminId for active chats');

            const activeChats = await ChatModel.find({
                users: adminId,
            })
                .populate('users', 'name')   // Populate to get names of users in the chat
                .populate('latestMessage');   // Populate latest message details
            console.log(activeChats, 'activeChats for admin');
            res.status(200).json(activeChats);
        } catch (error) {
            console.error('Error fetching active chats for admin:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    getMessagesAdmin: async (req: Request, res: Response) => {
        const { chatId } = req.params;
        try {
            const messages = await Message.find({ chat: chatId })
                .populate('sender', 'name')
                .sort({ createdAt: 1 });  // Sort messages by creation time

            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages for chat:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    getChats: async (req: Request, res: Response) => {
        try {
            const chats = await ChatModel.find({})
                .populate({ path: "users", select: "name" })
                .populate({
                    path: "latestMessage",
                    select: "content createdAt",
                })
                .sort({ "latestMessage.createdAt": -1 })
                .exec();

            res.status(200).json({ chats });
        } catch (error) {
            console.error("Error fetching chats:", error);
            res.status(500).json({ message: "Server error during chat retrieval" });
        }
    },
    getChatLists: async (req: Request, res: Response) => {
        try {
            const chats = await ChatModel.find()
                .populate('users', 'name')
                .populate('latestMessage', 'content createdAt')
                .sort({ 'latestMessage.createdAt': -1 });

            res.status(200).json(chats);
        } catch (error) {
            console.error("Error fetching chat list:", error);
            res.status(500).json({ message: "Server error fetching chat list" });
        }
    },
    successMessage: async (req: Request, res: Response) => {
        const { chatId } = req.params;
        const { content } = req.body;
        try {
          const newMessage = await adminInteractor.successMessage(chatId, content);
          res.status(200).json({ message: "Message sent successfully", newMessage });
        } catch (error) {
          console.error("Error sending success message:", error);
          res.status(500).json({ message: "Failed to send message" });
        }
      },
};
