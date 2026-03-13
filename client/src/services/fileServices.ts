import { api } from "../lib/axiosConfig"
import { CreateDesktopData, UpdateDesktopData } from "../types/desktop";
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

export const updateDesktopService = async (files: FilePositionsData) => {
    const response = await api.post(`/file/position`, files);

    return (response).data;
}

export const deleteFileService = async (id: string) => {
    const response = await api.delete(`/file/${id}`);

    return (response).data;
}
