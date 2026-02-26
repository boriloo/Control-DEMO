import { Router } from "express"
import { getMeController } from "../controllers/userController"

export const userRouter = Router()

// GET ALL USER DATA
userRouter.get("/me", getMeController)

// UPDATE USER DATA
userRouter.patch("/", (req, res) => {

})

// GET DESKTOP BY OWNER ID
userRouter.get("/:id/desktop", (req, res) => {

})