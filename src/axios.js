import axios from "axios";
import reduxStore from "./redux"; // Import store từ redux.js

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
});

instance.interceptors.response.use(
    // (response) => response.data,
    // (error) => {
    //     console.log("Lỗi từ interceptor:", error);
    //     return Promise.reject(error); // Thêm dòng này để lỗi tiếp tục truyền về `catch`
    // }
    (response) => {
        return response.data;
    }
);

instance.interceptors.request.use(
    (config) => {
        const state = reduxStore.getState();
        const token = state.user?.token; // Lấy token từ ReduxStore
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
