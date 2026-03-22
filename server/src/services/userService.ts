import { pool } from "../lib/postgres"
import { updateUserData, UserData } from "../types/user"

export const getMeService = async (id: string) => {

    const response = await pool.query('SELECT * FROM users WHERE id = $1', [id])

    if (response.rows.length === 0) {
        throw new Error("User doesn't exist.")
    }

    const user = response.rows[0]

    const { password: _, ...userWithoutPassword } = user


    return {
        ...userWithoutPassword,
        profile_image: user.profile_image.toString('base64')
    } as UserData

}

export const updateUserService = async (id: string, data: updateUserData) => {

    const fields: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    if (data.name) {
        fields.push(`name = $${queryIndex++}`);
        values.push(data.name);
    }

    if (data.profileImage) {
        fields.push(`profile_image = $${queryIndex++}`);
        values.push(data.profileImage);
    }

    if (data.filterDark) {
        fields.push(`filter_dark = $${queryIndex++}`);
        values.push(data.filterDark);
    }

    if (data.filterBlur) {
        fields.push(`filter_blur = $${queryIndex++}`);
        values.push(data.filterBlur);
    }


    if (data.filterColor) {
        fields.push(`filter_color = $${queryIndex++}`);
        values.push(data.filterColor);
    }

    if (fields.length === 0) {
        throw new Error("No fields provided for update.");
    }

    values.push(id);

    const query = `
        UPDATE users 
        SET ${fields.join(', ')} 
        WHERE id = $${queryIndex}
        RETURNING id, name, email, profile_image, filter_dark, filter_blur, filter_color, created_at;
    `;

    const response = await pool.query(query, values);

    if (response.rows.length === 0) {
        throw new Error("User not found.");
    }

    const updated = response.rows[0];

    console.log(updated)

    return {
        ...updated,
        profile_image: updated.profile_image ? updated.profile_image.toString('base64') : null
    };

}

export const deleteUserService = async (id: string) => {
    const response = await pool.query("SELECT id FROM users WHERE id = $1", [id])

    const userExists = response.rows.length > 0

    if (!userExists) {
        throw new Error("User doesn't exist.")
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id])

}