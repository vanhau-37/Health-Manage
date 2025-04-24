import axios from "../axios";

export const getAllDiseaseApi = (stringText, pageIndex) => {
    return axios.get("Diseases", { params: {stringText: stringText, pageIndex: pageIndex } });
};

export const getDiseaseByIdApi = (id) => {
    return axios.get(`Diseases/${id}`);
};

export const createDiseaseApi = (data) => {
    return axios.post("Diseases", data);
};

export const deleteDiseaseApi = (id) => {
    return axios.delete(`Diseases/${id}`);
};

export const updateDiseaseApi = (data) => {
    return axios.put("Diseases", data);
};

export const changeImageApi = (data) => {
    return axios.post("Diseases/upload-Disease-image", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const searchSymptomApi = (data) => {
    return axios.get("Symptoms/search", {params: {searchText:data}});
};
