import apiClient from "@/lib/apiClient";

// Interview Session endpoints
export const createInterview = async (data: any) => {
    const res = await apiClient.post('/api/interviews/', data);
    return res.data;
};

export const listInterviews = async (resumeId?: number, jobDescriptionId?: number) => {
    const params: any = {};
    if (resumeId) params.resume_id = resumeId;
    if (jobDescriptionId) params.job_description_id = jobDescriptionId;

    const res = await apiClient.get('/api/interviews/', { params });
    return res.data;
};

export const getInterview = async (id: number) => {
    const res = await apiClient.get(`/api/interviews/${id}/`);
    return res.data;
};

export const startInterview = async (id: number) => {
    const res = await apiClient.post(`/api/interviews/${id}/start/`);
    return res.data;
};

export const completeInterview = async (id: number) => {
    const res = await apiClient.post(`/api/interviews/${id}/complete/`);
    return res.data;
};

export const updateInterviewProgress = async (
    id: number,
    data: { current_question_index?: number; total_questions?: number }
) => {
    const res = await apiClient.patch(`/api/interviews/${id}/progress/`, data);
    return res.data;
};

// Question Generation
export const generateInterviewQuestions = async (id: number, numQuestions?: number) => {
    const res = await apiClient.post(`/api/interviews/${id}/generate-questions/`, {
        num_questions: numQuestions || 5,
    });
    return res.data;
};

export const getInterviewQuestions = async (id: number) => {
    const res = await apiClient.get(`/api/interviews/${id}/questions/`);
    return res.data;
};

export const getCurrentInterviewQuestion = async (id: number) => {
    const res = await apiClient.get(`/api/interviews/${id}/current-question/`);
    return res.data;
};

// Answers
export const submitInterviewAnswer = async (id: number, formData: FormData) => {
    const res = await apiClient.post(`/api/interviews/${id}/submit-answer/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const getInterviewAnswers = async (id: number) => {
    const res = await apiClient.get(`/api/interviews/${id}/answers/`);
    return res.data;
};

// Reports
export const generateInterviewReport = async (id: number) => {
    const res = await apiClient.post(`/api/interviews/${id}/generate-report/`);
    return res.data;
};

export const getInterviewReport = async (id: number) => {
    const res = await apiClient.get(`/api/interviews/${id}/report/`);
    return res.data;
};

export const matchResume = async (jobDescriptionId: number, resumeId: number) => {
    const res = await apiClient.post(`/api/interviews/job-descriptions/${jobDescriptionId}/match-resume/`, { resume_id: resumeId });
    return res.data;
}

export const matchAllResumes = async (jobDescriptionId: number) => {
    const res = await apiClient.post(`/api/interviews/job-descriptions/${jobDescriptionId}/match-all-resumes/`);
    return res.data;
}

export const getMatches = async (jobDescriptionId: number, params?: { status?: string; min_score?: number }) => {
    const res = await apiClient.get(`/api/interviews/job-descriptions/${jobDescriptionId}/matches/`, { params });
    return res.data;
}

export const getResumesForJD = async (jobDescriptionId: number, params?: { matched_only?: boolean; unmatched_only?: boolean }) => {
    const res = await apiClient.get(`/api/interviews/job-descriptions/${jobDescriptionId}/resumes/`, { params });
    return res.data;
}

export const getInterviewHistory = async (params?: { resume_id?: number; job_description_id?: number; status?: string; limit?: number; offset?: number }) => {
    const res = await apiClient.get('/api/interviews/history/', { params });
    return res.data;
}
