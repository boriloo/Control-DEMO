import { api } from "../lib/axiosConfig"
import { CreateDesktopData, UpdateDesktopData } from "../types/desktop";

export const createDesktopService = async (data: CreateDesktopData) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('backgroundImage', data.backgroundImage);

    const response = await api.post("/desktop", formData);

    return (response).data;
}

export const getDesktopByIdService = async (id: string) => {
    const response = await api.get(`/desktop/${id}`);

    return (response).data;
}

export const getDesktopByOwnerService = async () => {
    const response = await api.get("/desktop");

    return (response).data;
}

export const updateDesktopService = async (id: string, data: UpdateDesktopData) => {
    const formData = new FormData();

    if (data.name) {
        formData.append('name', data.name);
    }

    if (data.backgroundImage) {
        formData.append('backgroundImage', data.backgroundImage);
    }

    const response = await api.patch(`/desktop/${id}`, formData);

    return response.data;
}

export const deleteDesktopService = async (id: string) => {
    const response = await api.delete(`/desktop/${id}`,);

    return (response).data;
}