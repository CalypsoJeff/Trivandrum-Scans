import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { uploadToS3 } from '../../utils/s3Uploader';
import { v4 as uuidv4 } from 'uuid';
import Message from '../../infrastructure/database/dbModel/messageModel';

const handleSocketEvents = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Join a specific chat room
        socket.on('join_room', async (room) => {
            if (!mongoose.Types.ObjectId.isValid(room)) {
                console.error(`Invalid chat ID: ${room}`);
                return;
            }
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });

        // Send message (text, file, or audio) between User and Admin
        socket.on('sendMessage', async (data) => {
            try {
                let savedMessage;

                if (data.content?.trim()) {
                    // Save text message
                    savedMessage = await new Message({
                        chat: data.roomId,
                        sender: data.sender,
                        content: data.content,
                        senderModel: data.senderModel,
                        messageId: uuidv4(),
                    }).save();
                } else if (data.fileBase64) {
                    // Save file message
                    const buffer = Buffer.from(data.fileBase64, 'base64');
                    const file = { buffer, originalname: `${Date.now()}-${data.fileName}`, mimetype: data.fileType };
                    const { Location } = await uploadToS3(file);

                    savedMessage = await new Message({
                        chat: data.roomId,
                        sender: data.sender,
                        senderModel: data.senderModel,
                        fileUrl: Location,
                        fileName: data.fileName,
                        fileType: data.fileType,
                        isFile: true,
                        messageId: uuidv4(),
                    }).save();
                } else if (data.audio) {
                    // Save audio message
                    const buffer = Buffer.from(data.audio, 'base64');
                    const file = { buffer, originalname: `${Date.now()}-${data.voiceFileName}`, mimetype: data.voiceFileType || 'audio/webm' };
                    const { Location } = await uploadToS3(file);

                    savedMessage = await new Message({
                        chat: data.roomId,
                        sender: data.sender,
                        senderModel: data.senderModel,
                        fileUrl: Location,
                        fileName: data.voiceFileName,
                        fileType: data.voiceFileType,
                        isFile: true,
                        isVoice: true,
                        messageId: uuidv4(),
                    }).save();
                }

                if (savedMessage) {
                    io.to(data.roomId).emit('receiveMessage', savedMessage);

                    const unreadCount = await Message.countDocuments({ chat: data.roomId, senderModel: data.senderModel, read: false });
                    io.to(data.roomId).emit('unreadCount', { unreadCount, recipient: data.senderModel === 'User' ? 'Admin' : 'User' });
                }
            } catch (error) {
                console.error('Error processing message:', error);
                socket.emit('error', { message: 'Error processing message' });
            }
        });

        // Mark messages as read
        socket.on('messageRead', async ({ roomId, userId }) => {
            try {
                await Message.updateMany(
                    { chat: roomId, sender: { $ne: userId }, read: false },
                    { $set: { read: true } }
                );

                const unreadCount = await Message.countDocuments({ chat: roomId, sender: { $ne: userId }, read: false });
                io.to(roomId).emit('unreadCount', { roomId, unreadCount });
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        });

        // Handle typing indicator
        socket.on('typing', (data) => {
            socket.to(data.roomId).emit('typing', data);
        });

        // Handle message deletion
        socket.on('deleteMessage', async (messageId) => {
            try {
                const deletedMessage = await Message.findByIdAndUpdate(
                    messageId,
                    { deleted: true },
                    { new: true }
                );

                if (!deletedMessage) {
                    socket.emit('error', { message: 'Message not found' });
                    return;
                }

                if (deletedMessage.chat) {
                    const chatId = deletedMessage.chat.toString();
                    io.to(chatId).emit('messageDeleted', { messageId, deleted: true });
                }
            } catch (error) {
                console.error('Error marking message as deleted:', error);
                socket.emit('error', { message: 'Error deleting message' });
            }
        });

        // Handle socket disconnection
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

export default handleSocketEvents;
