import express from "express";
import session from "express-session";
import cors from "cors";
import path from 'path';
import MongoStore from "connect-mongo";
import { fileURLToPath } from "url";
import { createSocketServer } from './src/config/socket.js';
import connectDB from './src/config/mongodb.js';
import './src/config/env.js';
import apiRoute from "./src/router/index.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB(`${process.env.MONGODB_CONNECTION_STRING}/${process.env.MONGODB_DBNAME}`);
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
}));

const socketServer = createSocketServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, 'src/uploads')));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `${process.env.MONGODB_CONNECTION_STRING}/${process.env.MONGODB_DBNAME}`,
        ttl: 60 * 60 * 5 // 5 hours to destroy
    }),
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 5 // 5 hours to destroy
    }
}));

app.use('/api', apiRoute);

socketServer.listen(PORT, () => {
    console.log(`Server started successfully at Port number: ${PORT}`);
});

export { __dirname, __filename };