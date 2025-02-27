import axios from 'axios';

// Создаем инстанс axios с базовым URL из переменных окружения
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Перехватчик для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const stagesApi = {
  async getCurrentStage() {
    try {
      const response = await api.get('/stages/current');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getAllStages() {
    try {
      const response = await api.get('/stages');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async setStage(stageId) {
    try {
      const response = await api.put(`/stages/${stageId}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getStageById(stageId) {
    try {
      const response = await api.get(`/stages/${stageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getStagesHistory() {
    try {
      const response = await api.get('/stages/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};