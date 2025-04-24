import axios from "../axios";

export const getAllSymptomApi = (pageIndex) => {
    return axios.get("Symptoms", {params:{pageIndex: pageIndex}});
}

export const createSymptomApi = (data) => {
    return axios.post("Symptoms", data);
}

export const deleteSymptomApi = (id) => {
    return axios.delete(`Symptoms/${id}`);
}

export const updateSymptomApi = (data) => {
    return axios.put("Symptoms", data);
}