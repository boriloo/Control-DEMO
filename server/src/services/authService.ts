import { LoginData, RegisterData } from "../types/auth";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserData } from "../types/user";
import prisma from "../lib/prisma";


// Service for registering users
export const authRegisterService = async ({ name, email, password }: RegisterData) => {

    const userExists = await prisma.user.findUnique({
        where: { email }
    })

    if (userExists) {
        throw new Error("User already exists.")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    return await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, name: true, email: true, createdAt: true }
    })
}

// Service for logging users in
export const authLoginService = async ({ email, password, rememberMe }: LoginData) => {

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) throw new Error("Invalid email or password.")

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) throw new Error("Invalid email or password")

    const secret = process.env.JWT_SECRET
    const refreshSecret = process.env.JWT_REFRESH_SECRET

    const token = jwt.sign(
        { id: user.id, email: user.email },
        secret as string,
        { expiresIn: '1d' }
    )

    let refreshToken = null

    if (rememberMe === true) {
        refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            refreshSecret as string,
            { expiresIn: '30d' }
        )
    }

    const { password: _, ...userWithoutPassword } = user

    return {
        user: userWithoutPassword as UserData,
        token,
        refreshToken,
    }
}


export const authRefreshService = async (cookieToken: string) => {
    const refreshSecret = process.env.JWT_REFRESH_SECRET

    try {
        const decoded = jwt.verify(cookieToken, refreshSecret as string) as { id: string, email: string }

        const newToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        )

        return { token: newToken }
    } catch (err) {
        throw new Error("Invalid refresh token")
    }
}


