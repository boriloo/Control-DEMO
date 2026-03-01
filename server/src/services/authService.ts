import { pool } from "../lib/postgres";
import { LoginData, RegisterData } from "../types/auth";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserData } from "../types/user";


// Service for registering users
export const authRegisterService = async ({ name, email, password }: RegisterData) => {

    const response = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const userExists = response.rows.length > 0

    if (!userExists) {
        throw new Error("User already exists.")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
    `

    const values = [name, email, hashedPassword]
    const res = await pool.query(query, values)

    return res.rows[0]
}

// Service for logging users in
export const authLoginService = async ({ email, password, rememberMe }: LoginData) => {

    const query = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = query.rows[0]

    if (!user) {
        throw new Error("Invalid email or password.")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new Error("Invalid email or password")
    }

    const secret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    const token = jwt.sign(
        { id: user.id, email: user.email },
        secret as string,
        { expiresIn: '1d' });

    let refreshToken = null;

    if (rememberMe === true) {
        refreshToken = jwt.sign(
            { id: user.id, email: user.email },
            refreshSecret as string,
            { expiresIn: '30d' });

    }

    const { password: _, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword as UserData,
        token,
        refreshToken,
    }

}


export const authRefreshService = async (cookieToken: string) => {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    try {

        const decoded = jwt.verify(cookieToken, refreshSecret as string) as { id: string, email: string };

        const newToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        return { token: newToken };
    } catch (err) {
        throw new Error("Invalid refresh token");
    }
}