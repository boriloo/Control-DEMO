import { Request, Response } from 'express';
import { createFileService, deleteFileService, getAllFilesFromDesktopService, getFilesFromDesktopService, getFilesParentNamesService, updateFilePositionService } from '../services/fileService';
import { CreateFileBodyData, CreateFileData } from '../types/file';

export const createFileController = async (req: Request, res: Response) => {
    try {
        const ownerId = (req as any).userId;
        const desktopId = req.params.desktopId
        const data: CreateFileBodyData = req.body;

        if (!data || !ownerId) {
            return res.status(400).json({ error: "Missing fields." });
        }

        const fullData = {
            ...data,
            ownerId: ownerId as string,
            desktopId: desktopId as string
        }

        const file = await createFileService(fullData as CreateFileData);

        return res.status(201).json(file);

    } catch (err: any) {

        return res.status(500).json({ error: err })
    }

}


export const getAllFilesFromDesktopController = async (req: Request, res: Response) => {
    try {
        const desktopId = req.params.desktopId

        const files = await getAllFilesFromDesktopService(desktopId as string);

        return res.status(201).json(files);

    } catch (err: any) {

        if (err.message === "No Files were found.") {
            return res.status(404).json({ error: err.message })
        }

        return res.status(500).json({ error: 'Server Error' })
    }
}


export const getFilesFromDesktopController = async (req: Request, res: Response) => {
    try {
        const desktopId = req.params.desktopId

        const files = await getFilesFromDesktopService(desktopId as string);


        return res.status(201).json(files);

    } catch (err: any) {

        if (err.message === "No Files were found.") {
            return res.status(404).json({ error: err.message })
        }

        return res.status(500).json({ error: 'Server Error' })
    }
}

export const getFilesParentNamesController = async (req: Request, res: Response) => {
    try {
        const { parentId } = req.body

        const names = await getFilesParentNamesService(parentId)

        return res.status(201).json(names);

    } catch (err: any) {

        if (err.message === "Root files have no parents.") {
            return res.status(404).json({ error: err.message })
        }

        return res.status(500).json({ error: 'Server Error' })
    }

}


export const updateFilePositionController = async (req: Request, res: Response) => {
    try {
        const files = req.body

        await updateFilePositionService(files);

        return res.status(200).json({ updated: files.length })

    } catch (err: any) {

        if (err.message === "No files received.") {
            return res.status(404).json({ error: err.message })
        }

        return res.status(500).json({ error: 'Server Error' })
    }
}

export const deleteFileController = async (req: Request, res: Response) => {
    try {
        const fileId = req.params.fileId

        await deleteFileService(fileId as string);

        return res.status(204).send();
    } catch (err: any) {

        if (err.message === "File doesn't exist.") {
            return res.status(404).json({ error: err.message })
        }

        return res.status(500).json({ error: 'Server Error' })
    }
}