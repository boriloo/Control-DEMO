import { api } from "../lib/axiosConfig"
import { CreateDesktopData } from "../types/desktop";

export const createDesktopService = async (data: CreateDesktopData) => {
    const response = await api.post("/desktop", data, { headers: { 'Content-Type': 'multipart/form-data'} });

    return (response).data;
}

