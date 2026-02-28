import axios from "axios";

export const api = axios.create({
    baseURL: `http://localhost:3000`,
})


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
            originalRequest._retry = true;
            
            try {
                const response = await axios.post("http://localhost:3000/auth/refresh", {}, { 
                    withCredentials: true
                });

                const { token } = response.data;
                localStorage.setItem("accessToken", token);

                originalRequest.headers.Authorization = `Bearer ${token}`;

                return axios(originalRequest); 
            } catch (refreshError) {
             
                localStorage.removeItem("accessToken");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);