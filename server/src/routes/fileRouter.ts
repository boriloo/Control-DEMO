import { Router } from "express"
import { createFileController, getAllFilesFromDesktopController, getFilesFromDesktopController, getFilesParentNamesController, updateFilePositionController } from "../controllers/fileController"
import { isSingleDesktopOwner } from "../middlewares/desktopMiddleware"

export const fileRouter = Router()

// CREATE NEW FILE
fileRouter.post("/:desktopId", isSingleDesktopOwner, createFileController)

// GET FILE BY ID
fileRouter.get("/:fileId", (req, res) => {

})

// GET FILE FROM OWNERID
fileRouter.get("/", (req, res) => {

})

// GET FILES FROM DESKTOP
fileRouter.get("/desktop/:desktopId", isSingleDesktopOwner, getFilesFromDesktopController)

// GET ALL FILES FROM DESKTOP
fileRouter.get("/desktop/all/:desktopId", isSingleDesktopOwner, getAllFilesFromDesktopController)

// GET FILES PARENT NAMES
fileRouter.get("/parent", getFilesParentNamesController)


// UPDATE FILE POSITION
fileRouter.put("/position", isSingleDesktopOwner, updateFilePositionController)

// DELETE FILE
fileRouter.delete("/:fileId", (req, res) => {

})