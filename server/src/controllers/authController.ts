import { Request, Response } from 'express';
import { authRegisterService } from "../services/auth";
import { RegisterData } from "../types/auth";

export const authRegisterController = async (req: Request, res: Response) => {

    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing fields." });
        }

        const user = await authRegisterService({ name, email, password } as RegisterData);

        return res.status(201).json(user);

    } catch (err: any) {

        if (err.message === 'User already exists.') {
            return res.status(400).json({ error: err.message })
        }

        console.error(err);
        return res.status(500).json({ error: "Server Error" })
    }

}