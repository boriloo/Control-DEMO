import { pool } from "../lib/postgres";
import { CreateDesktopData } from "../types/desktop";


// export type FullDesktopData = DesktopData & { id: string };

// ----AQUI DEVE TER----------

//CREATE DESKTOP

export const createDesktopService = async ({ name, ownerId, backgroundImage }: CreateDesktopData) => {
    const query = `
    INSERT INTO desktops (name, owner, backgroundImage)
    VALUES ($1, $2, $3)
    RETURNING id, name, ownerId, backgroundImage, created_at
    `

    const values = [name, ownerId, backgroundImage]

    const response = await pool.query(query, values)

    return response.rows[0]

}

//GET DESKTOP BY ID

//GET DESKTOPS BY OWNER ID

//GET DESKTOPS BY MEMBER

//UPDATE DESKTOP

//DELETE DESKTOP

//----------------------------


