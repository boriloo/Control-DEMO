import { Request, Response } from 'express';
import { deleteUserService, getMeService } from '../services/userService';


export const getMeController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId

        const user = await getMeService(userId as string)

        res.status(201).json(user)
    } catch (err: any) {
        if (err.message === "User doesn't exist.")
            res.status(400).json({ error: err.message })
    }
    return res.status(500).json({ error: "Server Error" });
}

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId

        await deleteUserService(userId as string);

        return res.status(204).send();
    } catch (err: any) {

        if (err.message === "User doesn't exist.") {
            return res.status(404).json({ error: err.message })
        }

        return res.status(500).json({ error: 'Server Error' })
    }
}