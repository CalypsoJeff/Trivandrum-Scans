
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Server, Socket } from 'socket.io';
// import mongoose from 'mongoose';
// import MessageModel from '../../infrastructure/database/dbModel/messageModel';
// import ChatModel from '../../infrastructure/database/dbModel/chatModel';

// const onlineUsers = new Map(); // To keep track of online users

// const handleSocketEvents = (io: Server) => {
//     io.on('connection', (socket: Socket) => {
//         console.log(`Socket connected: ${socket.id}`);

//         // Join room based on chat ID
//         socket.on('join_room', async (roomId) => {
//             if (!mongoose.Types.ObjectId.isValid(roomId)) {
//                 console.error(`Invalid chat ID: ${roomId}`);
//                 return;
//             }
//             socket.join(roomId);
//             console.log(`Socket ${socket.id} joined room ${roomId}`);
//         });

//         socket.on('user_connected', (userId) => {
//             onlineUsers.set(userId, socket.id);
//             io.emit('online_status', { userId, status: 'online' });
//             console.log(`User ${userId} is online.`);
//         });

//         socket.on('admin_connected', (adminId) => {
//             onlineUsers.set(adminId, socket.id);
//             io.emit('online_status', { adminId, status: 'online' });
//             console.log(`Admin ${adminId} is online.`);
//         });

//         socket.on('get_online_status', ({ userId, adminId }) => {
//             const isUserOnline = onlineUsers.has(userId);
//             const isAdminOnline = onlineUsers.has(adminId);
//             socket.emit('online_status_update', { userId, status: isUserOnline ? 'online' : 'offline' });
//             socket.emit('online_status_update', { adminId, status: isAdminOnline ? 'online' : 'offline' });
//         });


//         // Handle sending a text message
//         socket.on('sendMessage', async (data) => {
//             try {
//                 console.log('Received message data:', data);

//                 if (!data.content || !data.content.trim()) {
//                     console.error('Empty message content');
//                     socket.emit('error', { message: 'Message content is empty.' });
//                     return;
//                 }

//                 // Save message to the database
//                 const newMessage = new MessageModel({
//                     chat: data.chatId,
//                     sender: data.sender,
//                     senderModel: data.senderModel,
//                     content: data.content,
//                     createdAt: new Date(),
//                 });
//                 const savedMessage = await newMessage.save();

//                 // Update the latest message in ChatModel and increment unread count
//                 const chatUpdate = await ChatModel.findByIdAndUpdate(
//                     data.chatId,
//                     {
//                         latestMessage: savedMessage._id,
//                         $inc: { [`unreadCount.${data.recipientId}`]: 1 },
//                     },
//                     { new: true }
//                 );

//                 // Emit message to all users in the room
//                 if (chatUpdate) {
//                     io.to(data.chatId).emit('receiveMessage', savedMessage);
//                     console.log('Message saved and sent:', savedMessage);
//                     const unreadCounts = await MessageModel.countDocuments({
//                         senderModel: data.senderModel,
//                         read: false,
//                     });
//                     if (data.senderModel === 'User') {
//                         console.log("Calculated unread countU:", unreadCounts);
//                         io.to(data.roomId).emit('unreadCount', { unreadCount: unreadCounts, recipient: 'Admin' });
//                     } else if (data.senderModel === 'Admin') {
//                         console.log("Calculated unread countA:", unreadCounts);
//                         io.to(data.roomId).emit('unreadCount', { unreadCount: unreadCounts, recipient: 'User' });
//                     }
//                 } else {
//                     console.error('Failed to update chat with latest message');
//                     socket.emit('error', { message: 'Failed to update chat' });
//                 }

//             } catch (error) {
//                 console.error('Error processing message:', error);
//                 socket.emit('error', { message: 'Error processing message' });
//             }
//         });

//         // Typing indicator
//         socket.on('typing', (data) => {
//             socket.to(data.roomId).emit('typing', data);
//         });
//         socket.on('messageRead', async ({ chatId, userId }) => {
//             try {
//                 await MessageModel.updateMany(
//                     { chat: chatId, sender: { $ne: userId }, read: false },
//                     { $set: { read: true } }
//                 );

//                 const updatedMessages = await MessageModel.find({ chat: chatId });
//                 io.to(chatId).emit('messagesUpdated', updatedMessages);

//                 const unreadCounts = await MessageModel.countDocuments({
//                     chat: chatId,
//                     sender: { $ne: userId },
//                     read: false,
//                 });
//                 // Notify the recipient of the unread count
//                 const recipientId = [...onlineUsers.entries()].find(
//                     ([key, value]) => value !== socket.id
//                 )?.[0]; // Get recipient ID from online users
//                 if (recipientId) {
//                     io.to(recipientId).emit('unreadCount', { chatId, unreadCounts });
//                 }
//             } catch (error) {
//                 console.error('Error marking messages as read:', error);
//             }
//         });


//         // Handle disconnect
//         socket.on("disconnect", () => {
//             const disconnectedId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
//             if (disconnectedId) {
//                 onlineUsers.delete(disconnectedId);
//                 io.emit("online_status_update", { userId: disconnectedId, status: "offline" });
//                 console.log(`User or Admin with ID ${disconnectedId} went offline.`);
//             }
//             console.log(`Socket disconnected: ${socket.id}`);
//         });
//     });
// };

// export default handleSocketEvents;



//* eslint-disable @typescript-eslint/no-unused-vars */
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import MessageModel from '../../infrastructure/database/dbModel/messageModel';
import ChatModel from '../../infrastructure/database/dbModel/chatModel';

// Track online users
const onlineUsers = new Map<string, string>(); // Map of userId to socketId

const handleSocketEvents = (io: Server): void => {
    io.on('connection', (socket: Socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Event: Join a chat room
        socket.on('join_room', async (roomId: string) => {
            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                console.error(`Invalid chat ID: ${roomId}`);
                return;
            }
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });

        // Event: User connects
        socket.on('user_connected', (userId: string) => {
            onlineUsers.set(userId, socket.id);
            io.emit('online_status', { userId, status: 'online' });
            console.log(`User ${userId} is online.`);
        });

        // Event: Admin connects
        socket.on('admin_connected', (adminId: string) => {
            onlineUsers.set(adminId, socket.id);
            io.emit('online_status', { adminId, status: 'online' });
            console.log(`Admin ${adminId} is online.`);
        });

        // Event: Check online status
        socket.on('get_online_status', ({ userId, adminId }: { userId: string; adminId: string }) => {
            const isUserOnline = onlineUsers.has(userId);
            const isAdminOnline = onlineUsers.has(adminId);

            socket.emit('online_status_update', { userId, status: isUserOnline ? 'online' : 'offline' });
            socket.emit('online_status_update', { adminId, status: isAdminOnline ? 'online' : 'offline' });
        });

        // Event: Send a message
        socket.on('sendMessage', async (data, ack) => {
            try {
                if (!data.content.trim()) {
                    console.error('Empty message content');
                    ack?.({ success: false, error: 'Message content is empty.' });
                    return;
                }

                const newMessage = new MessageModel({
                    chat: data.chatId,
                    sender: data.sender,
                    senderModel: data.senderModel,
                    content: data.content,
                    createdAt: new Date(),
                });
                const savedMessage = await newMessage.save();

                // Emit "delivered" status to recipient if online
                const recipientSocketId = onlineUsers.get(data.recipientId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('messageStatusUpdate', {
                        messageId: savedMessage._id,
                        status: 'delivered',
                    });
                }

                // Emit acknowledgment to sender
                ack?.({ success: true, messageId: savedMessage._id });

                // Emit the new message to the room
                io.to(data.chatId).emit('receiveMessage', savedMessage);
            } catch (error) {
                console.error('Error processing message:', error);
                ack?.({ success: false, error: 'Error processing message.' });
            }
        });

        // Event: Typing indicator
        socket.on('typing', (data: { roomId: string; userId: string }) => {
            socket.to(data.roomId).emit('typing', data);
        });

        // Event: Mark messages as read
        socket.on('messageRead', async ({ chatId, userId }: { chatId: string; userId: string }) => {
            try {
                console.log(chatId,'151555');
                
                // Update message read status in the database
                await MessageModel.updateMany(
                    { chat: chatId, sender: { $ne: userId }, read: false },
                    { $set: { read: true, readAt: new Date() } }
                );

                // Notify room members of the updated messages
                const messages = await MessageModel.find({ chat: chatId });
                io.to(chatId).emit('messagesUpdated', messages);

                // Reset the unread count for the user in the chat
                await ChatModel.findByIdAndUpdate(chatId, {
                    $set: { [`unreadCount.${userId}`]: 0 },
                });

                console.log(`Messages in chat ${chatId} marked as read by user ${userId}`);
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        });

        // Event: Handle socket disconnect
        socket.on('disconnect', () => {
            const disconnectedId = [...onlineUsers.entries()].find(([, id]) => id === socket.id)?.[0];
            if (disconnectedId) {
                onlineUsers.delete(disconnectedId);
                io.emit('online_status_update', { userId: disconnectedId, status: 'offline' });
                console.log(`User or Admin with ID ${disconnectedId} went offline.`);
            }
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

export default handleSocketEvents;
