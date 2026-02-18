import { Router } from "express"
import { authRegisterController } from "../controllers/authController"

export const authRouter = Router()

// AUTH REGISTER
authRouter.post("/register", authRegisterController)

// AUTH LOGIN
// authRouter.post("/login", (req, res) => {

// })
