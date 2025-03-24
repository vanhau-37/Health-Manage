import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true
});

instance.interceptors.response.use(
    // (response) => response.data,
    // (error) => {
    //     console.log("Lỗi từ interceptor:", error);
    //     return Promise.reject(error); // Thêm dòng này để lỗi tiếp tục truyền về `catch`
    // }
    (response) => {
        const { data } = response;
        return response.data;
    }
);

export default instance;
