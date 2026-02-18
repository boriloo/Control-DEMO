import { pool } from "../lib/postgres";
import { LoginData, RegisterData } from "../types/auth";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Service for registering users
export const authRegisterService = async ({ name, email, password }: RegisterData) => {

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (userExists.rows.length > 0) {
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
export const authLoginService = async ({ email, password }: LoginData) => {

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
    const token = jwt.sign(
        { id: user.id, email: user.email },
        secret as string,
        { expiresIn: '1d' });

    const { password: _, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token
    }

}