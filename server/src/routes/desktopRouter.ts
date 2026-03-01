import { Router } from "express"
import { createDesktopController, getDesktopByIdController, getDesktopByOwnerController } from "../controllers/desktopController"
import multer from 'multer';
import { isDesktopsOwner, isSingleDesktopOwner } from "../middlewares/desktopMiddleware";
const storage = multer.memoryStorage(); // Mantém o arquivo na RAM como Buffer
const upload = multer({ storage });

export const desktopRouter = Router()

// CREATE DESKTOP
desktopRouter.post("/", upload.single('backgroundImage'), createDesktopController)

// GET DESKTOP BY ID
desktopRouter.get("/:id", isSingleDesktopOwner, getDesktopByIdController)

// GET DESKTOP BY OWNER
desktopRouter.get("/", isDesktopsOwner, getDesktopByOwnerController)

// UPDATE DESKTOP 
desktopRouter.patch("/:desktopId", (req, res) => {

})

// GET DESKTOP ROOT FILES
desktopRouter.get("/:desktopId/root-files", (req, res) => {

})

// GET ALL DESKTOP FILES
desktopRouter.get("/:desktopId/files", (req, res) => {

})