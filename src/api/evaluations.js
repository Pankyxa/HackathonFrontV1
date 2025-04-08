import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Добавляем перехватчик для токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const evaluationsApi = {
  async getUnevaluatedTeams() {
    try {
      const response = await api.get('/evaluations/unevaluated-teams');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getMyEvaluations() {
    try {
      const response = await api.get('/evaluations/my-evaluations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createEvaluation(evaluationData) {
    try {
      const response = await api.post('/evaluations/evaluate-team', evaluationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getTeamEvaluations(teamId) {
    try {
      const response = await api.get(`/evaluations/team/${teamId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getDetailedEvaluations() {
    try {
      const response = await api.get('/evaluations/detailed');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};