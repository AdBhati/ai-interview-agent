import apiClient from "@/lib/apiClient";

export const uploadResume = async (formData: FormData) => {
    const res = await apiClient.post('/api/resumes/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const listResumes = async () => {
    const res = await apiClient.get('/api/resumes/');
    return res.data;
};

export const getResume = async (id: number) => {
    const res = await apiClient.get(`/api/resumes/${id}/`);
    return res.data;
};

export const extractResumeText = async (id: number) => {
    const res = await apiClient.post(`/api/resumes/${id}/extract/`);
    return res.data;
};