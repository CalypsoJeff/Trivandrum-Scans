// startChat: async (req: Request, res: Response) => {
//     const { userId } = req.params;
//     const adminId = '66ee588d1e1448fbea1f40bb';

//     try {
//       let chat = await ChatModel.findOne({ users: { $all: [userId, adminId] } });
//       if (!chat) {
//         chat = await ChatModel.create({ users: [userId, adminId], isAccepted: true });
//       }
//       res.status(200).json({ success: true, chat });
//     } catch (error) {
//       console.error('Error starting chat:', error);
//       res.status(500).json({ success: false, message: 'Could not start chat' });
//     }
//   },


//   import { Router } from "express";
// import ChatModel from "../../infrastructure/database/dbModel/chatModel";
// import { uploadToS3 } from "../../utils/s3Uploader";
// import Message from "../../infrastructure/database/dbModel/messageModel";

// const messageRouter = Router()
// interface MessageData {
//     chat: string;
//     sender: unknown;
//     senderModel: unknown;
//     content?: string;
//     fileUrl?: string;
//     fileName?: string;
//     fileType?: string;
//     isFile?: boolean;
// }

// messageRouter.get('/chat/start/:userId', async (req, res) => {
//     const { userId } = req.params;
//     const adminId = '66ee588d1e1448fbea1f40bb'; 

//     try {
//         let chat = await ChatModel.findOne({ users: { $all: [userId, adminId] } });
//         if (!chat) {
//             chat = await ChatModel.create({ users: [userId, adminId], isAccepted: true });
//         }
//         res.status(200).json({ success: true, chat });
//     } catch (error) {
//         console.error('Error starting chat:', error);
//         res.status(500).json({ success: false, message: 'Could not start chat' });
//     }
// });
// messageRouter.post('/chat/:chatId/send', async (req, res) => {
//     console.log("Message send route hit");
//     const { chatId } = req.params;
//     const { sender, senderModel, content, fileBase64, fileName, fileType } = req.body;

//     try {
//         // Define messageData with optional file properties
//         let messageData: MessageData = { chat: chatId, sender, senderModel, content };

//         if (fileBase64 && fileName && fileType) {
//             const buffer = Buffer.from(fileBase64, 'base64');
//             const file = { buffer, originalname: fileName, mimetype: fileType };
//             const { Location } = await uploadToS3(file);
//             messageData = { ...messageData, fileUrl: Location, fileName, fileType, isFile: true };
//         }

//         const message = await Message.create(messageData);
//         res.status(200).json({ success: true, message });
//     } catch (error) {
//         console.error('Error sending message:', error);
//         res.status(500).json({ success: false, message: 'Could not send message' });
//     }
// });
// // messageRouter.post('/:chatId/send',async(req, res)=> {
// //         const { chatId } = req.params;
// //         const { sender, senderModel, content, fileBase64, fileName, fileType } = req.body;

// //         try {
// //             // Prepare the message data
// //             let messageData: any = { chat: chatId, sender, senderModel, content };

// //             // If there is a file to upload, handle the file upload and add to message data
// //             if (fileBase64 && fileName && fileType) {
// //                 const buffer = Buffer.from(fileBase64, "base64");
// //                 const file = { buffer, originalname: fileName, mimetype: fileType };
// //                 const { Location } = await uploadToS3(file);
// //                 messageData = { ...messageData, fileUrl: Location, fileName, fileType, isFile: true };
// //             }

// //             // Create and save the message
// //             const message = await Message.create(messageData);

// //             // Update the latest message in the chat
// //             await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message._id });

// //             res.status(201).json({ success: true, message });
// //         } catch (error) {
// //             console.error("Error creating message:", error);
// //             res.status(500).json({ success: false, message: "Could not create message" });
// //         }
// //     }
// // )




import { Request, Response } from "express";
import ChatModel from "../../infrastructure/database/dbModel/chatModel";
import Message from "../../infrastructure/database/dbModel/messageModel";
import { uploadToS3 } from "../../utils/s3Uploader";

interface MessageData {
    chat: string;
    sender: unknown;
    senderModel: unknown;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    isFile?: boolean;
}

export default {
    startChat: async (req: Request, res: Response) => {
        const { userId } = req.params;
        const adminId = '66ee588d1e1448fbea1f40bb';

        try {
            let chat = await ChatModel.findOne({ users: { $all: [userId, adminId] } });
            if (!chat) {
                chat = await ChatModel.create({ users: [userId, adminId]});
            }
            res.status(200).json({ success: true, chat });
        } catch (error) {
            console.error('Error starting chat:', error);
            res.status(500).json({ success: false, message: 'Could not start chat' });
        }
    }, 

    sendMessage: async (req: Request, res: Response) => {
        console.log("Message send route hit");
        const { chatId } = req.params;
        const { sender, senderModel, content, fileBase64, fileName, fileType } = req.body;

        try {
            let messageData: MessageData = { chat: chatId, sender, senderModel, content };

            if (fileBase64 && fileName && fileType) {
                const buffer = Buffer.from(fileBase64, 'base64');
                const file = { buffer, originalname: fileName, mimetype: fileType };
                const { Location } = await uploadToS3(file);
                messageData = { ...messageData, fileUrl: Location, fileName, fileType, isFile: true };
            }

            const message = await Message.create(messageData);
            res.status(200).json({ success: true, message });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ success: false, message: 'Could not send message' });
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
