import { pool } from "../lib/postgres";
import { CreateFileData, FilePositionsData } from "../types/file";

export const createFileService = async (data: CreateFileData) => {
    console.log('ARQUIVASSO', data)

    const query = `
    INSERT INTO files (name, owner_id, desktop_id, parent_id, file_type, xPos, yPos, url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, name, owner_id, desktop_id, parent_id, file_type, xPos, yPos, url, created_at
    `

    const values = [data.name, data.ownerId, data.desktopId, data.parentId, data.fileType, data.xPos, data.yPos, data.url]

    const response = await pool.query(query, values)

    const desktop = response.rows[0]

    return desktop;

}

//GET DESKTOP BY ID

export const getAllFilesFromDesktopService = async (desktopId: string) => {
    const response = await pool.query("SELECT * FROM files WHERE desktop_id = $1", [desktopId])
    const filesExists = response.rows.length > 0

    if (!filesExists) {
        throw new Error("No Files were found.")
    }

    const files = response.rows

    return files
}

//GET DESKTOP BY ID

export const getFilesFromDesktopService = async (desktopId: string) => {
    const response = await pool.query("SELECT * FROM files WHERE desktop_id = $1 AND parent_id = 'root'", [desktopId])

    const files = response.rows

    return files
}

//GET DESKTOP BY ID

export const getFilesParentNamesService = async (parentId: string) => {
    if (parentId === "root") throw new Error("Root files have no parents.")

    const parentNames: string[] = [];
    let currentId = parentId;

    while (currentId !== 'root') {
        const query = 'SELECT parent_id, name FROM files WHERE id = $1';
        const result = await pool.query(query, [currentId]);

        if (result.rows.length === 0) break;

        const file = result.rows[0];

        parentNames.push(file.name);

        currentId = file.parent_id;
    }

    return parentNames;
};

// UPDATE FILE POSITION 
export const updateFilePositionService = async (files: FilePositionsData[]) => {
    if (files.length < 1) throw new Error("No files received.");

    const query = 'UPDATE files SET (xpos, ypos) VALUES ($1, $2) WHERE id = $3'

    files.forEach(async (file) => {
        const values = [file.xPos, file.yPos, file.id]

        await pool.query(query, values)
    })
}


// DELETE FILE 
export const deleteFileService = async (id: string) => {
    const response = await pool.query("SELECT id FROM files WHERE id = $1", [id])

    const fileExists = response.rows.length > 0

    if (!fileExists) {
        throw new Error("File doesn't exist.")
    }

    await pool.query("DELETE FROM files WHERE id = $1", [id])

}

// UPDATE FILE POSITION

export const updateFilePositionService = async (position: { x: number, y: number }) => {

    const query = `
    INSERT INTO files (name, owner_id, desktop_id, parent_id, file_type, xPos, yPos, url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, name, owner_id, desktop_id, parent_id, file_type, xPos, yPos, url, created_at
    `

    const values = [data.name, data.ownerId, data.desktopId, data.parentId, data.fileType, data.xPos, data.yPos, data.url]

    const response = await pool.query(query, values)

    const desktop = response.rows[0]

    return desktop;

}
