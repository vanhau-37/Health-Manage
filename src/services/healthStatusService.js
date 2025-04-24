import axios from "../axios";

export const getAllHealthStatusApi = (pageIndex) => {
    return axios.get("HealthStatuses", {params:{pageIndex: pageIndex}});
};
export const getAllHealthStatusByIdApi = (id, from, to, pageIndex) => {
    return axios.get(`HealthStatuses/${id}`, {params:{from, to, pageIndex}});
};

export const createHealthStatusApi = (data) => {
    return axios.post("HealthStatuses", data);
}

export const deleteHealthStatusApi = (id) => {
    return axios.delete(`HealthStatuses/${id}`);
}

export const updateHealthStatusApi = (data) => {
    return axios.put("HealthStatuses", data);
}

export const diagnosisDisease = (data ) => {
    return axios.post("Diagnoses", data);
}