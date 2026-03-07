import { Router } from "express"

export const fileRouter = Router()

// CREATE NEW FILE
fileRouter.post("/", (req, res) => {

})

// GET FILE BY ID
fileRouter.get("/:fileId", (req, res) => {

})

// GET FILE FROM OWNERID
fileRouter.get("/", (req, res) => {

})

// GET FILE FROM DESKTOP
fileRouter.get("/desktop/:desktopId", (req, res) => {

})

// UPDATE FILE POSITION
fileRouter.post("/:fileId/position", (req, res) => {

})

// DELETE FILE
fileRouter.delete("/:fileId", (req, res) => {

})