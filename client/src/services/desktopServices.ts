import { api } from "../lib/axiosConfig"
import { CreateDesktopData, UpdateDesktopData } from "../types/desktop";

export const createDesktopService = async (data: CreateDesktopData) => {
    const response = await api.post("/desktop", data, { headers: { 'Content-Type': 'multipart/form-data' } });

    return (response).data;
}

// FALTA O GET DESKTOP BY ID

export const getDesktopByOwnerService = async () => {
    const response = await api.get("/desktop");

    return (response).data;
}

export const updateDesktopService = async (id: string, data: UpdateDesktopData) => {
    const response = await api.patch(`/desktop/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

    return (response).data;
}

export const deleteDesktopService = async (id: string) => {
    const response = await api.delete(`/desktop/${id}`,);

    return (response).data;
}