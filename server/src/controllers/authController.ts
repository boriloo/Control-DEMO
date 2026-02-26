import { Request, Response } from 'express';
import { authLoginService, authRefreshService, authRegisterService } from "../services/authService";
import { LoginData, RegisterData } from "../types/auth";

function daysInMilliseconds(num: number) {
    return (num * 24 * 60 * 60 * 1000)
}

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
        return res.status(500).json({ error: "Server Error." })
    }

}

export const authLoginController = async (req: Request, res: Response) => {
    try {
        const { email, password, rememberMe } = req.body

        if (!email || !password || typeof rememberMe !== 'boolean') {
            return res.status(400).json({ error: "Missing fields." });
        }

        const user = await authLoginService({ email, password, rememberMe } as LoginData);

        if (user.refreshToken) {
            res.cookie('refreshCookie', user.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: daysInMilliseconds(30)
            })
        }

        const { refreshToken: _, ...userWithoutRefresh } = user;
        return res.status(201).json(userWithoutRefresh);


    } catch (err: any) {

        if (err.message === 'Invalid email or password') {
            return res.status(400).json({ error: err.message })
        }

        console.error(err);
        return res.status(500).json({ error: "Server Error." })
    }

}


export const authRefreshController = async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshCookie;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token not found" });
    }

    try {
        const data = await authRefreshService(refreshToken);
        return res.status(200).json(data);
    } catch (err) {
        return res.status(401).json({ error: "Session expired" });
    }
}