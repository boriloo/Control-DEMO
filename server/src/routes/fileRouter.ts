import { Router } from "express"
import { createFileController, deleteFileController, getAllFilesFromDesktopController, getFileByIdController, getFilesFromDesktopController, getFilesFromParentController, getFilesParentNamesController, updateFilePositionController } from "../controllers/fileController"
import { isSingleDesktopOwner } from "../middlewares/desktopMiddleware"
import { deleteFileService } from "../services/fileService"

export const fileRouter = Router()

// CREATE NEW FILE
fileRouter.post("/:desktopId", isSingleDesktopOwner, createFileController)

// GET FILE BY ID
fileRouter.get("/:fileId/desktop/:desktopId", isSingleDesktopOwner, getFileByIdController)

// GET FILE FROM OWNERID
fileRouter.get("/", (req, res) => {

})

// GET FILES FROM DESKTOP
fileRouter.get("/desktop/:desktopId", isSingleDesktopOwner, getFilesFromDesktopController)

// GET ALL FILES FROM DESKTOP
fileRouter.get("/desktop/all/:desktopId", isSingleDesktopOwner, getAllFilesFromDesktopController)

// GET FILES FROM PARENT
fileRouter.get("/desktop/:desktopId/parent/:parentId", isSingleDesktopOwner, getFilesFromParentController)

// GET FILES PARENT NAMES
fileRouter.get("/desktop/:desktopId/parent-names/:parentId", isSingleDesktopOwner, getFilesParentNamesController)

// UPDATE FILE POSITION
fileRouter.put("/position", updateFilePositionController)

// DELETE FILE
fileRouter.delete("/:fileId", deleteFileController)