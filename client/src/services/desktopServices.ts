import { api } from "../lib/axiosConfig"
import { CreateDesktopData } from "../types/desktop";

export const createDesktopService = async (data: CreateDesktopData) => {
    const response = await api.post("/desktop", data, { headers: { 'Content-Type': 'multipart/form-data' } });

    return (response).data;
}

// FALTA O GET DESKTOP BY ID

export const getDesktopByOwnerService = async () => {
    const response = await api.get("/desktop");

    return (response).data;
}