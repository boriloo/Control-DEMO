import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as { id: string };
        (req as any).userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }

}