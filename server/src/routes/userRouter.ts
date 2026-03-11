import { Router } from "express"
import { deleteUserController, getMeController } from "../controllers/userController"

export const userRouter = Router()

// GET ALL USER DATA
userRouter.get("/me", getMeController)

// UPDATE USER DATA
userRouter.patch("/", (req, res) => {

})

// DELETE USER
userRouter.delete("/:userId", deleteUserController)

