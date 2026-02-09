import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT

app.listen(port, () => {
    console.log(`⭐ servidor rodando na porta ${port} ⭐`)
})

app.use("/user", )