// index.ts
import { Server as SocketIOServer } from 'socket.io';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './infrastructure/config/database';
import userRoutes from './interfaces/routes/userRoutes';
import adminRoutes from './interfaces/routes/adminRoutes';
import http from "http";
import cookieParser from 'cookie-parser';
import messageRoutes from './interfaces/routes/messageRoutes';
import Message from './infrastructure/database/dbModel/messageModel';

dotenv.config();
connectDb();

const app = express();
const server = http.createServer(app);
export const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "MY_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users/messages', messageRoutes);
app.use('/api/admin/messages', messageRoutes);

// Store connected admin socket
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let adminSocket: any = null;

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Listen for a client identifying as admin or user
    socket.on("identify", (role) => {
        if (role === 'admin') {
            adminSocket = socket;
            console.log("Admin connected:", socket.id);
        } else {
            console.log("User connected:", socket.id);
        }
    });

    // Listen for joining a specific chat room
    socket.on("joinChat", async (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat room: ${chatId}`);

        // Send chat history to the joining client
        try {
            const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
            socket.emit("chatHistory", messages);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    });

    // Listen for a new message from any client
    socket.on("sendMessage", async (data) => {
        const { chatId, sender, senderModel, content } = data;

        try {
            // Ensure we have all required data
            if (!chatId || !sender || !senderModel || !content) {
                console.error("Incomplete message data:", data);
                return;
            }

            // Save the message in the database
            const newMessage = await Message.create({
                chat: chatId,
                sender,
                senderModel,
                content,
                createdAt: new Date()
            });

            // Broadcast the message to all clients in the chat room except sender
            io.to(chatId).emit("receiveMessage", newMessage);
            console.log("Message saved and broadcasted:", newMessage);

            // Optional: Notify the admin if not in the same room
            if (senderModel === 'user' && adminSocket && !adminSocket.rooms.has(chatId)) {
                adminSocket.emit("newMessageNotification", { chatId, content });
            }

        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    // Handle disconnection of clients
    socket.on("disconnect", () => {
        if (socket === adminSocket) {
            console.log("Admin disconnected:", socket.id);
            adminSocket = null;
        } else {
            console.log("User disconnected:", socket.id);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

