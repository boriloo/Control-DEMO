import { Request, Response } from 'express';
import { createDesktopService } from "../services/desktopService";
import { CreateDesktopData } from "../types/desktop";

export const createDesktopController = async (req: Request, res: Response) => {
    const ownerId = (req as any).userId

    try {
        const { name, backgroundImage } = req.body

        if (!name || !ownerId || !backgroundImage) {
            return res.status(400).json({ error: "Missing fields." });
        }

        const desktop = await createDesktopService({ name, ownerId, backgroundImage } as CreateDesktopData);

        return res.status(201).json(desktop);

    } catch (err: any) {

        return res.status(500).json({ error: "Server Error." })
    }

}