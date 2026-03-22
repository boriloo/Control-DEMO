import { Router } from "express"
import { createDesktopController, deleteDesktopController, getDesktopByIdController, getDesktopByOwnerController, updateDesktopController } from "../controllers/desktopController"
import multer from 'multer';
import { isDesktopsOwner, isSingleDesktopOwner } from "../middlewares/desktopMiddleware";
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const desktopRouter = Router()

// CREATE DESKTOP
desktopRouter.post("/", upload.single('backgroundImage'), createDesktopController)

// GET DESKTOP BY ID
desktopRouter.get("/:desktopId", isSingleDesktopOwner, getDesktopByIdController)

// GET DESKTOP BY OWNER
desktopRouter.get("/", isDesktopsOwner, getDesktopByOwnerController)

// UPDATE DESKTOP 
desktopRouter.patch("/:desktopId", upload.single('backgroundImage'), isSingleDesktopOwner, updateDesktopController)

// DELETE DESKTOP
desktopRouter.delete("/:desktopId", isSingleDesktopOwner, deleteDesktopController)