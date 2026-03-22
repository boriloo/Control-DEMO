import { Router } from "express"
import { deleteUserController, getMeController, updateUserController } from "../controllers/userController"
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });


export const userRouter = Router()

// GET ALL USER DATA
userRouter.get("/me", getMeController)

// UPDATE USER DATA
// UPDATE DESKTOP 
userRouter.patch("/", upload.single('profileImage'), updateUserController)

// DELETE USER
userRouter.delete("/", deleteUserController)

