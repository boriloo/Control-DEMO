import { Router } from "express"
import { createDesktopController } from "../controllers/desktopController"
import multer from 'multer';
const storage = multer.memoryStorage(); // Mantém o arquivo na RAM como Buffer
const upload = multer({ storage });

export const desktopRouter = Router()

// CREATE DESKTOP
desktopRouter.post("/", upload.single('backgroundImage'), createDesktopController)

// GET DESKTOP BY ID
desktopRouter.get("/:desktopId", (req, res) => {

})

// UPDATE DESKTOP 
desktopRouter.patch("/:desktopId", (req, res) => {

})

// GET DESKTOP ROOT FILES
desktopRouter.get("/:desktopId/root-files", (req, res) => {

})

// GET ALL DESKTOP FILES
desktopRouter.get("/:desktopId/files", (req, res) => {

})