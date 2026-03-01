import { NextFunction, Request, Response } from 'express';
import { pool } from '../lib/postgres';

export const isDesktopOwner = async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = (req as any).userId
    const { desktopId } = req.params

    try {
        const response = await pool.query('SELECT id FROM desktops WHERE id = $1 AND owner_id = $2', [desktopId, ownerId])

        if (response.rows.length > 0) {
            next();
        } else {
            return res.status(403).json({ error: "User is not desktop owner" });
        }
    } catch {
        return res.status(500).json({ error: "Server Error." })
    }

}