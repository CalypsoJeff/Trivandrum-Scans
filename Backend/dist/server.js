"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
// index.ts
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./infrastructure/config/database"));
const userRoutes_1 = __importDefault(require("./interfaces/routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./interfaces/routes/adminRoutes"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const messageRoutes_1 = __importDefault(require("./interfaces/routes/messageRoutes"));
const socketHandler_1 = __importDefault(require("./domain/helper/socketHandler"));
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            'http://localhost:5173'
        ],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
(0, socketHandler_1.default)(exports.io);
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: [
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'Head', 'POST', 'PUT', 'DELETE', "PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.options('*', (0, cors_1.default)(corsOptions));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "MY_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/users/messages', messageRoutes_1.default);
app.use('/api/admin/messages', messageRoutes_1.default);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
