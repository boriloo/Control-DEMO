import { Router } from "express"
import { authLoginController, authLogoutController, authRefreshController, authRegisterController } from "../controllers/authController"
import { authMiddleware } from "../middlewares/authMiddleware"

export const authRouter = Router()

// AUTH REGISTER
authRouter.post("/register", authRegisterController)

// AUTH LOGIN
authRouter.post("/login", authLoginController)

// AUTH REFRESH
authRouter.post("/refresh", authRefreshController)

// AUTH LOGOUT
authRouter.post("/logout", authLogoutController)