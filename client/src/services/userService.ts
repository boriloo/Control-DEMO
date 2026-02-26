import { api } from "../lib/axiosConfig"

export const getMeService = async () => {
    const response = await api.get("/user/me");

    return (response).data;
}

