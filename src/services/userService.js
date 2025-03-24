import axios from "../axios";

export const handleLoginApi = (user) => {
    return axios.post("/Users/Login", user);
}