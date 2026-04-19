import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { authRouter } from "./routes/authRouter";
import { userRouter } from "./routes/userRouter";
import { authMiddleware } from "./middlewares/authMiddleware";
import { desktopRouter } from "./routes/desktopRouter";
import { fileRouter } from "./routes/fileRouter";

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

const port = process.env.SERVER_PORT || 3000;

app.use("/auth", authRouter);
app.use("/user", authMiddleware, userRouter);
app.use("/desktop", authMiddleware, desktopRouter);
app.use("/file", authMiddleware, fileRouter);

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});