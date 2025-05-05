import axios from "../axios";

export const handleLoginApi = (user) => {
    return axios.post("/Users/Login", user);
}

export const getAllUserApi = (pageIndex) => {
    return axios.get("/Users", {params:{pageIndex: pageIndex}});
}

export const getAllUserByIdApi = (id) => {
    return axios.get(`/Users/${id}`);
}

export const createUserApi = (data) => {
    return axios.post("/Users/Register", data);
}

export const deleteUserApi = (id) => {
    return axios.delete(`/Users/${id}` );
}

export const editUserApi = (user) => {
    return axios.put("/Users", user);
}

export const editUserInfoApi = (user) => {
    return axios.put("/Users/Update", user);
}