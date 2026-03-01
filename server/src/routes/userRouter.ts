import { Router } from "express"
import { getMeController } from "../controllers/userController"

export const userRouter = Router()

// GET ALL USER DATA
userRouter.get("/me", getMeController)

// GET DESKTOPS BY OWNER ID
userRouter.get("/desktop/owner", (req, res) => {

})

// UPDATE USER DATA
userRouter.patch("/", (req, res) => {

})

