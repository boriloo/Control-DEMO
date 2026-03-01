import express from "express";
import cors from "cors";
import "dotenv/config";
import { authRouter } from "./routes/authRouter"
import { userRouter } from "./routes/userRouter";
import { authMiddleware } from "./middlewares/authMiddleware";
import cookieParser from 'cookie-parser';
import { desktopRouter } from "./routes/desktopRouter";


const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const port = process.env.SERVER_PORT

app.listen(port, () => {
    console.log(` Servidor rodando na porta ${port} `)
})

app.use("/auth", authRouter)
app.use("/user", authMiddleware, userRouter)
app.use("/desktop", authMiddleware, desktopRouter)