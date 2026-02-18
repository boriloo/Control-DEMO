import { Router } from "express"

export const desktopRouter = Router()

// CREATE DESKTOP
desktopRouter.post("/", (req, res) => {

})

// GET DESKTOP BY ID
desktopRouter.get("/:desktopId", (req, res) => {

})

// UPDATE DESKTOP 
desktopRouter.patch("/:desktopId", (req, res) => {

})

// GET DESKTOP ROOT FILES
desktopRouter.get("/:desktopId/rootFiles", (req, res) => {

})

// GET ALL DESKTOP FILES
desktopRouter.get("/:desktopId/Files", (req, res) => {

})