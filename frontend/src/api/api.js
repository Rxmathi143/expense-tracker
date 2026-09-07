import axios from "axios";

const api = axios.create({
    baseURL: "https://expense-tracker-back-4143.onrender.com/api/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    return config;
});

export default api;
