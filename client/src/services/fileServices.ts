import { api } from "../lib/axiosConfig"
import { CreateDesktopData, UpdateDesktopData } from "../types/desktop";
import { CreateFileData } from "../types/file";

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

export const getFilesParentNamesService = async (parentId: string) => {
    const response = await api.post(`/file/parent`, parentId);

    return (response).data;
}
