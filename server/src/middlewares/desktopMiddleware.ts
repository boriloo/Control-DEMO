import { NextFunction, Request, Response } from 'express';
import { pool } from '../lib/postgres';

export const isSingleDesktopOwner = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = (req as any).userId

    const desktopId = req.params.desktopId

    try {
        const response = await pool.query('SELECT id FROM desktops WHERE id = $1 AND owner_id = $2', [desktopId, ownerId])

        console.log(response.rows)

        if (response.rows.length > 0) {
            console.log('vamos seguir')
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

    try {
        const response = await pool.query('SELECT id FROM desktops WHERE owner_id = $1', [ownerId])

        if (response.rows.length > 0) {
            next();
        } else {
            return res.status(403).json({ error: "No Desktops were found." });
        }
    } catch {
        return res.status(500).json({ error: "Server Error." })
    }

}