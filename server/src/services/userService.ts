import { pool } from "../lib/postgres"
import { UserData } from "../types/user"

export const getMeService = async (id: string) => {

    const response = await pool.query('SELECT * FROM users WHERE id = $1', [id])

    if (response.rows.length === 0) {
        throw new Error("User doesn't exist.")
    }

    const user = response.rows[0]

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword as UserData;
}

export const deleteUserService = async (id: string) => {
    const response = await pool.query("SELECT id FROM users WHERE id = $1", [id])

    const userExists = response.rows.length > 0

    if (!userExists) {
        throw new Error("User doesn't exist.")
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id])

}