import { NextFunction, Request, Response } from 'express';
import { pool } from '../lib/postgres';

export const isSingleDesktopOwner = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = (req as any).userId

    console.log(ownerId)

    const desktopId = req.params.id

    console.log(desktopId)

    try {
        const response = await pool.query('SELECT id FROM desktops WHERE id = $1 AND owner_id = $2', [desktopId, ownerId])

        console.log(response.rows)

        if (response.rows.length > 0) {
            next();
        } else {
            return res.status(403).json({ error: "User is not desktop owner" });
        }
    } catch {
        return res.status(500).json({ error: "Server Error." })
    }

}

export const isDesktopsOwner = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = (req as any).userId

    console.log(ownerId)

    try {
        const response = await pool.query('SELECT id FROM desktops WHERE owner_id = $1', [ownerId])

        console.log(response.rows)

        if (response.rows.length > 0) {
            next();
        } else {
            return res.status(403).json({ error: "No Desktops were found." });
        }
    } catch {
        return res.status(500).json({ error: "Server Error." })
    }

}