import { Router } from "express"
import { authLoginController, authRefreshController, authRegisterController } from "../controllers/authController"

export const authRouter = Router()

// AUTH REGISTER
authRouter.post("/register", authRegisterController)
// AUTH LOGIN
authRouter.post("/login", authLoginController)
// AUTH REFRESH
authRouter.post("/refresh", authRefreshController)
