import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './infrastructure/config/database';
import userRoutes from './interfaces/routes/userRoutes'
import adminRoutes from './interfaces/routes/adminRoutes'

// import { createServer } from 'http';
import http from "http"
// import { connect } from 'http2';
import cookieParser from 'cookie-parser';
const app = express();
const server =http.createServer(app);

dotenv.config();
connectDb();

const PORT = process.env.PORT || 5000 ; 
const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE',"PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(session({
    secret:"MY_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false}
    }));

    app.use('/api/users',userRoutes)
    app.use('/api/admin',adminRoutes)

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    
})