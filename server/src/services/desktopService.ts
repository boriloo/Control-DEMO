import { pool } from "../lib/postgres";
import { CreateDesktopData } from "../types/desktop";


// export type FullDesktopData = DesktopData & { id: string };

// ----AQUI DEVE TER----------

//CREATE DESKTOP

export const createDesktopService = async ({ name, ownerId, backgroundImage }: CreateDesktopData) => {
    const query = `
    INSERT INTO desktops (name, owner_id, background_image)
    VALUES ($1, $2, $3)
    RETURNING id, name, owner_id, background_image, created_at
    `

    const values = [name, ownerId, backgroundImage]

    const response = await pool.query(query, values)

    const desktop = response.rows[0]

    return {
        ...desktop,
        backgroundImage: desktop.background_image.toString('base64')
    }

}

//GET DESKTOP BY ID

//GET DESKTOPS BY OWNER ID

//GET DESKTOPS BY MEMBER

//UPDATE DESKTOP

//DELETE DESKTOP

//----------------------------


