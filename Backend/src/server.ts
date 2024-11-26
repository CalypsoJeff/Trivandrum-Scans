// index.ts
import { Server } from 'socket.io';
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
import handleSocketEvents from './domain/helper/socketHandler';

dotenv.config();
connectDb();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: [
            // 'https://trivandrum-scans-cq38.vercel.app',
            // 'https://trivandrumscans-ffl74s6pz-jephyjvarghese-gmailcoms-projects.vercel.app',
            // 'http://localhost:5173',
            // 'https://trivandrum-scans-punalur.vercel.app/',
            'https://trivandrum-scans-zh4r.vercel.app'

        ],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

handleSocketEvents(io);

const PORT = process.env.PORT || 5000;
const corsOptions = {
    // origin: ['http://localhost:5173'],
    origin: [
        // 'https://trivandrum-scans-cq38.vercel.app',
        // 'http://localhost:5173',
        'https://trivandrum-scans-zh4r.vercel.app'

    ],

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options('*', cors(corsOptions));

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

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

