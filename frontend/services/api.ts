/**
 * API service for communicating with the Django backend
 */
import axios from 'axios';

// Backend API base URL
// Heroku deployed backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-interview-agent-4b4b22e44ca7.herokuapp.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For CORS with credentials
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Health check
  health: () => apiClient.get('/api/health/'),

  // User endpoints (to be implemented)
  // users: {
  //   login: (data) => apiClient.post('/api/users/login/', data),
  //   register: (data) => apiClient.post('/api/users/register/', data),
  // },

  // Resume endpoints
  resumes: {
    upload: (formData: FormData) => apiClient.post('/api/resumes/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    list: () => apiClient.get('/api/resumes/'),
    get: (id: number) => apiClient.get(`/api/resumes/${id}/`),
    extractText: (id: number) => apiClient.post(`/api/resumes/${id}/extract/`),
  },

  // Job Description endpoints
  jobDescriptions: {
    create: (data: any) => apiClient.post('/api/interviews/job-descriptions/', data),
    list: (resumeId?: number) => {
      const params = resumeId ? { params: { resume_id: resumeId } } : {};
      return apiClient.get('/api/interviews/job-descriptions/', params);
    },
    get: (id: number) => apiClient.get(`/api/interviews/job-descriptions/${id}/`),
    update: (id: number, data: any) => apiClient.put(`/api/interviews/job-descriptions/${id}/update/`, data),
    delete: (id: number) => apiClient.delete(`/api/interviews/job-descriptions/${id}/delete/`),
  },

  // Interview Session endpoints
  interviews: {
    create: (data: any) => apiClient.post('/api/interviews/', data),
    list: (resumeId?: number, jobDescriptionId?: number) => {
      const params: any = {};
      if (resumeId) params.resume_id = resumeId;
      if (jobDescriptionId) params.job_description_id = jobDescriptionId;
      return apiClient.get('/api/interviews/', { params });
    },
    get: (id: number) => apiClient.get(`/api/interviews/${id}/`),
    start: (id: number) => apiClient.post(`/api/interviews/${id}/start/`),
    complete: (id: number) => apiClient.post(`/api/interviews/${id}/complete/`),
    updateProgress: (id: number, data: { current_question_index?: number; total_questions?: number }) =>
      apiClient.patch(`/api/interviews/${id}/progress/`, data),
    // Question Generation endpoints
    generateQuestions: (id: number, numQuestions?: number) =>
      apiClient.post(`/api/interviews/${id}/generate-questions/`, { num_questions: numQuestions || 5 }),
    getQuestions: (id: number) => apiClient.get(`/api/interviews/${id}/questions/`),
    getCurrentQuestion: (id: number) => apiClient.get(`/api/interviews/${id}/current-question/`),
    // Answer endpoints
    submitAnswer: (id: number, formData: FormData) => apiClient.post(`/api/interviews/${id}/submit-answer/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAnswers: (id: number) => apiClient.get(`/api/interviews/${id}/answers/`),
    // Report endpoints
    generateReport: (id: number) => apiClient.post(`/api/interviews/${id}/generate-report/`),
    getReport: (id: number) => apiClient.get(`/api/interviews/${id}/report/`),
  },

  // Audio endpoints (to be implemented)
  // audio: {
  //   upload: (formData) => apiClient.post('/api/audio/upload/', formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //   }),
  // },

  // Reports endpoints (to be implemented)
  // reports: {
  //   get: (id) => apiClient.get(`/api/reports/${id}/`),
  // },
};

export default apiClient;

