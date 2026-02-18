import { Router } from "express"

export const fileRouter = Router()

// CREATE NEW FILE
fileRouter.post("/", (req, res) => {

})

// GET FILE BY ID
fileRouter.get("/:fileId", (req, res) => {

})

// UPDATE FILE POSITION
fileRouter.post("/:fileId/position", (req, res) => {

})

// DELETE FILE
fileRouter.delete("/:fileId", (req, res) => {

})