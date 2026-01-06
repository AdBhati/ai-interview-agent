import apiClient from "@/lib/apiClient";

export const createJobDescription = async (data: any) => {
    const res = await apiClient.post('/api/interviews/job-descriptions/', data);
    return res.data;
};

export const listJobDescriptions = async (resumeId?: number) => {
    const params = resumeId ? { params: { resume_id: resumeId } } : {};
    const res = await apiClient.get('/api/interviews/job-descriptions/', params);
    return res.data;
};

export const getJobDescription = async (id: number) => {
    const res = await apiClient.get(`/api/interviews/job-descriptions/${id}/`);
    return res.data;
};

export const updateJobDescription = async (id: number, data: any) => {
    const res = await apiClient.put(`/api/interviews/job-descriptions/${id}/update/`, data);
    return res.data;
};

export const deleteJobDescription = async (id: number) => {
    const res = await apiClient.delete(`/api/interviews/job-descriptions/${id}/delete/`);
    return res.data;
};
