import { Router } from "express";
import messageController from "../controllers/messageController";

const messageRouter = Router();

// Route to start a chat between User and Admin
messageRouter.get('/chat/start/:userId', messageController.startChat);
// Route to get all messages in a chat
messageRouter.get('/chat/:chatId/messages', messageController.getMessages);

export default messageRouter;
