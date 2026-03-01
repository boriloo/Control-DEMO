import { Request, Response } from 'express';
import { createDesktopService, getDesktopByIdService, getDesktopByOwnerService } from "../services/desktopService";
import { CreateDesktopData } from "../types/desktop";

export const createDesktopController = async (req: Request, res: Response) => {
    try {
        const ownerId = (req as any).userId;
        const { name } = req.body;
        const backgroundImage = req.file?.buffer;

        if (!name || !ownerId || !backgroundImage) {
            return res.status(400).json({ error: "Missing fields." });
        }

        const desktop = await createDesktopService({ name, ownerId, backgroundImage } as CreateDesktopData);

        return res.status(201).json(desktop);

    } catch (err: any) {

        return res.status(500).json({ error: err })
    }

}


export const getDesktopByIdController = async (req: Request, res: Response) => {
    try {
        const desktopId = req.params.id

        const desktop = await getDesktopByIdService(desktopId as string);

        return res.status(201).json(desktop);
    } catch (err: any) {

        if (err.message = "Desktop doesn't exist.") {
            return res.status(404).json({ error: 'Server Error' })
        }

        return res.status(500).json({ error: 'Server Error' })
    }
}



export const getDesktopByOwnerController = async (req: Request, res: Response) => {
    try {
        const ownerId = (req as any).userId;

        const desktops = await getDesktopByOwnerService(ownerId);

        return res.status(201).json(desktops);
    } catch (err: any) {

        if (err.message = "No desktops were found.") {
            return res.status(404).json({ error: err.message })
        }

        return res.status(500).json({ error: 'Server Error' })
    }
}