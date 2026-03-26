import { api } from "../lib/axiosConfig"
import { CreateFileData, FilePositionsData } from "../types/file";

export const createFileService = async (desktopId: string, data: CreateFileData) => {
    const response = await api.post(`/file/${desktopId}`, data);

    return (response).data;
}

export const getFilesFromDesktopService = async (desktopId: string) => {
    const response = await api.get(`/file/desktop/${desktopId}`);

    return (response).data;
}

export const getAllFilesFromDesktopService = async (desktopId: string) => {
    const response = await api.get(`/file/desktop/all/${desktopId}`);

    return (response).data;
}

export const getFileByIdService = async (fileId: string, desktopId: string) => {
    const response = await api.get(`/file/${fileId}/desktop/${desktopId}`);

    return (response).data;
}

export const getFilesFromParentService = async (desktopId: string, parentId: string) => {

    const response = await api.get(`/file/desktop/${desktopId}/parent/${parentId}`);

    return (response).data;
}

// fileRouter.get("/desktop/:desktopId/parent", isSingleDesktopOwner, getFilesParentNamesController)

export const getFileParentNamesService = async (desktopId: string, parentId: string) => {

    const response = await api.get(`/file/desktop/${desktopId}/parent-names/${parentId}`,);

    return (response).data;
}

export const updateFilePositionService = async (files: FilePositionsData[]) => {
    const response = await api.put(`/file/position`, files);

    return (response).data;
}

export const deleteFileService = async (id: string) => {
    const response = await api.delete(`/file/${id}`);

    return (response).data;
}
