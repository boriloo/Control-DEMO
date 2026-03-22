import { api } from "../lib/axiosConfig"
import { updateUserData } from "../types/auth";

export const getMeService = async () => {
    const response = await api.get("/user/me");

    return (response).data;
}

export const updateUserService = async (data: updateUserData) => {
    console.log(data)
    const formData = new FormData();

    if (data.name) {
        formData.append('name', data.name);
    }

    if (data.profileImage) {
        formData.append('profileImage', data.profileImage);
    }

    if (data.filterDark) {
        formData.append('filterDark', data.filterDark);
    }

    if (data.filterBlur) {
        formData.append('filterBlur', data.filterBlur);
    }

    if (data.filterColor) {
        formData.append('filterColor', data.filterColor);
    }


    const response = await api.patch(`/user`, formData);

    return response.data;
}

export const deleteUserService = async (id: string) => {
    const response = await api.delete(`/user/${id}`)

    return (response).data;
}