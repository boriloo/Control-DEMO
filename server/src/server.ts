import express from "express";
import cors from "cors";
import "dotenv/config";
import { authRouter } from "./routes/authRouter"

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000

app.listen(port, () => {
    console.log(`⭐ servidor rodando na porta ${port} ⭐`)
})

app.use("/auth", authRouter)