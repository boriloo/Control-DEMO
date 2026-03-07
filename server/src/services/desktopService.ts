import { pool } from "../lib/postgres";
import { CreateDesktopData } from "../types/desktop";


// export type FullDesktopData = DesktopData & { id: string };

// ----AQUI DEVE TER----------

//CREATE DESKTOP

export const createDesktopService = async (data: CreateDesktopData) => {
    const query = `
    INSERT INTO files (name, owner_id, background_image)
    VALUES ($1, $2, $3)
    RETURNING id, name, owner_id, background_image, created_at
    `

    const values = [data.name, data.ownerId, data.backgroundImage]

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

// export const getDesktopByMemberService = async (ownerId: string) => {
//     const response = await pool.query("SELECT * FROM desktops WHERE owner_id = $1", [ownerId])
//     const desktopExists = response.rows.length > 0

//     if (!desktopExists) {
//         throw new Error("No desktops were found.")
//     }

//     const desktops = response.rows

//     return desktops.map((desktop) => ({
//         ...desktop,
//         background_image: desktop.background_image ? desktop.background_image.toString('base64') : null
//     }))

// }

//UPDATE DESKTOP

export const updateDesktopService = async (id: string, data: { name?: string; backgroundImage?: Buffer }) => {
    const fields: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    if (data.name) {
        fields.push(`name = $${queryIndex++}`);
        values.push(data.name);
    }

    if (data.backgroundImage) {
        fields.push(`background_image = $${queryIndex++}`);
        values.push(data.backgroundImage);
    }

    if (fields.length === 0) {
        throw new Error("No fields provided for update.");
    }

    values.push(id);

    const query = `
        UPDATE desktops 
        SET ${fields.join(', ')} 
        WHERE id = $${queryIndex}
        RETURNING id, name, background_image;
    `;

    const response = await pool.query(query, values);

    if (response.rows.length === 0) {
        throw new Error("Desktop not found.");
    }

    const updated = response.rows[0];

    return {
        ...updated,
        background_image: updated.background_image ? updated.background_image.toString('base64') : null
    };
};

//DELETE DESKTOP

export const deleteDesktopService = async (id: string) => {
    const response = await pool.query("SELECT id FROM desktops WHERE id = $1", [id])

    const desktopExists = response.rows.length > 0

    if (!desktopExists) {
        throw new Error("Desktop doesn't exist.")
    }

    await pool.query("DELETE FROM desktops WHERE id = $1", [id])

}

//----------------------------


