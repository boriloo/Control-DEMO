import { api } from "../lib/axiosConfig"

export const getMeService = async () => {
    const response = await api.get("/user/me");

    return (response).data;
}

export const deleteUserService = async (id: string) => {
    const response = await api.delete(`/user/${id}`)

    return (response).data;
}