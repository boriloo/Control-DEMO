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
        background_image: desktop.background_image.toString('base64')
    }

}

//GET DESKTOP BY ID

export const getDesktopByIdService = async (id: string) => {
    const response = await pool.query("SELECT * FROM desktops WHERE id = $1", [id])
    const desktopExists = response.rows.length > 0

    if (!desktopExists) {
        throw new Error("Desktop doesn't exist.")
    }

    const desktop = response.rows[0]

    return {
        ...desktop,
        background_image: desktop.background_image.toString('base64')
    }

}


//GET DESKTOPS BY OWNER ID

export const getDesktopByOwnerService = async (ownerId: string) => {
    const response = await pool.query("SELECT * FROM desktops WHERE owner_id = $1", [ownerId])
    const desktopExists = response.rows.length > 0

    if (!desktopExists) {
        throw new Error("No desktops were found.")
    }

    const desktops = response.rows

    return desktops.map((desktop) => ({
        ...desktop,
        background_image: desktop.background_image ? desktop.background_image.toString('base64') : null
    }))

}


//GET DESKTOPS BY MEMBER

//UPDATE DESKTOP

//DELETE DESKTOP

//----------------------------


